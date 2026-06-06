import type {
  ClipPropertyNode,
  NotesExpression,
  ParseResult,
  ProgramNode,
  StatementNode,
} from "./ast";
import { diagnostic, type Diagnostic } from "./diagnostics";
import { tokenize } from "./tokenizer";
import type { Token, TokenType } from "./tokens";

class Parser {
  private index = 0;
  readonly diagnostics: Diagnostic[] = [];
  constructor(private readonly tokens: Token[]) {}

  parse(): ProgramNode {
    const body = this.parseStatements();
    return { type: "Program", body, loc: { line: 1, column: 1, offset: 0 } };
  }

  private parseStatements(untilBrace = false): StatementNode[] {
    const body: StatementNode[] = [];
    while (!this.check("eof") && !(untilBrace && this.check("rbrace"))) {
      if (this.match("newline")) continue;
      const statement = this.parseStatement();
      if (statement) body.push(statement);
      else this.sync();
    }
    if (untilBrace) {
      if (this.match("rbrace")) return body;
      const token = this.peek();
      this.error(token, "UNCLOSED_BLOCK", "El bloque no está cerrado.");
    }
    return body;
  }

  private parseStatement(): StatementNode | null {
    const token = this.peek();
    if (token.type === "lbracket") return this.parseChord();
    if (token.type !== "word") {
      this.error(token, "UNKNOWN_COMMAND", `Comando inesperado "${token.value}".`);
      return null;
    }
    this.advance();
    switch (token.value) {
      case "tempo": return { type: "Tempo", bpm: Number(this.consumeValue("INVALID_TEMPO", "Falta un tempo válido.").value), loc: token.loc };
      case "instrument": return { type: "Instrument", name: this.consumeValue("UNKNOWN_INSTRUMENT", "Falta el instrumento.").value, loc: token.loc };
      case "volume": return { type: "Volume", db: Number(this.consumeValue("INVALID_VOLUME", "Falta un volumen válido.").value), loc: token.loc };
      case "play": return { type: "Play", name: this.consumeValue("INVALID_PLAY", "Falta el nombre a reproducir.").value, loc: token.loc };
      case "rest": return { type: "Rest", duration: this.consumeValue("INVALID_DURATION", "Falta la duración.").value, loc: token.loc };
      case "chord": return {
        type: "NamedChord",
        root: this.consumeValue("INVALID_CHORD", "Falta la raíz del acorde.").value,
        quality: this.consumeValue("INVALID_CHORD", "Falta la calidad del acorde.").value,
        duration: this.consumeValue("INVALID_DURATION", "Falta la duración.").value,
        loc: token.loc,
      };
      case "loop": {
        const count = Number(this.consumeValue("INVALID_LOOP", "Loop requiere un número.").value);
        return { type: "Loop", count, body: this.parseBlock(), loc: token.loc };
      }
      case "pattern": {
        const name = this.consumeValue("INVALID_PATTERN", "Falta el nombre del pattern.").value;
        return { type: "Pattern", name, body: this.parseBlock(), loc: token.loc };
      }
      case "channel": {
        const name = this.consumeValue("INVALID_CHANNEL", "Falta el nombre del canal.").value;
        return { type: "Channel", name, body: this.parseBlock(), loc: token.loc };
      }
      case "clip": return this.parseClip(token);
      default:
        if (/^[A-G][#b]?\d$/.test(token.value) || /^[A-Z]/.test(token.value)) {
          return { type: "Note", note: token.value, duration: this.consumeValue("INVALID_DURATION", "Falta la duración.").value, loc: token.loc };
        }
        this.error(token, "UNKNOWN_COMMAND", `Comando desconocido "${token.value}".`);
        return null;
    }
  }

  private parseClip(start: Token): StatementNode {
    const name = this.consumeValue("INVALID_CLIP", "Falta el nombre del clip.").value;
    if (!this.match("lbrace")) {
      this.error(this.peek(), "EXPECTED_BLOCK", "Clip requiere un bloque.");
      return { type: "Clip", name, properties: [], loc: start.loc };
    }
    const properties: ClipPropertyNode[] = [];
    while (!this.check("eof") && !this.check("rbrace")) {
      if (this.match("newline")) continue;
      const key = this.advance();
      if (key.value === "notes") {
        properties.push({ type: "NotesProperty", value: this.parseNotesExpression(), loc: key.loc });
      } else if (key.value === "randomNotes") {
        properties.push({ type: "RandomNotesProperty", value: this.parseNotesExpression(), loc: key.loc });
      } else if (key.value === "pattern") {
        properties.push({ type: "ScribblePatternProperty", value: this.lineValues().join(""), loc: key.loc });
      } else if (key.value === "subdiv") {
        properties.push({ type: "SubdivProperty", value: this.consumeValue("INVALID_SUBDIV", "Falta la subdivisión.").value, loc: key.loc });
      } else if (key.value === "dur") {
        properties.push({ type: "DurProperty", value: this.consumeValue("INVALID_DURATION", "Falta la duración.").value, loc: key.loc });
      } else if (key.value === "arp" && this.check("lbrace")) {
        properties.push({ type: "NotesProperty", value: this.parseAdvancedArp(), loc: key.loc });
      } else {
        this.error(key, "INVALID_CLIP_PROPERTY", `Propiedad de clip desconocida "${key.value}".`);
        this.sync();
      }
    }
    if (!this.match("rbrace")) this.error(this.peek(), "UNCLOSED_BLOCK", "El clip no está cerrado.");
    return { type: "Clip", name, properties, loc: start.loc };
  }

  private parseNotesExpression(): NotesExpression {
    const first = this.consumeValue("INVALID_NOTES", "Faltan notas.");
    if (first.value === "scale") {
      return { kind: "scale", tonic: this.consumeValue("INVALID_SCALE", "Falta la tónica.").value, scale: this.consumeValue("INVALID_SCALE", "Falta la escala.").value };
    }
    if (first.value === "arp") return { kind: "arp", chords: this.lineValues().join(" ") };
    if (first.value === "progression") {
      const tonic = this.consumeValue("INVALID_PROGRESSION", "Falta la tónica.").value;
      const scale = this.consumeValue("INVALID_PROGRESSION", "Falta la escala.").value;
      return { kind: "progression", tonic, scale, degrees: this.lineValues() };
    }
    return { kind: "notes", values: [first.value, ...this.lineValues()] };
  }

  private parseAdvancedArp(): NotesExpression {
    this.match("lbrace");
    let chords = "";
    let count: number | undefined;
    let order: string | undefined;
    while (!this.check("eof") && !this.check("rbrace")) {
      if (this.match("newline")) continue;
      const key = this.advance().value;
      if (key === "chords") chords = this.lineValues().join(" ");
      else if (key === "count") count = Number(this.consumeValue("INVALID_ARP", "Falta count.").value);
      else if (key === "order") order = this.consumeValue("INVALID_ARP", "Falta order.").value;
      else this.sync();
    }
    this.match("rbrace");
    return { kind: "arp", chords, count, order };
  }

  private parseChord(): StatementNode {
    const start = this.advance();
    const notes: string[] = [];
    while (!this.check("eof") && !this.check("rbracket")) notes.push(this.advance().value);
    if (!this.match("rbracket")) this.error(this.peek(), "UNCLOSED_CHORD", "El acorde no está cerrado.");
    const duration = this.consumeValue("INVALID_DURATION", "Falta la duración.").value;
    return { type: "Chord", notes, duration, loc: start.loc };
  }

  private parseBlock(): StatementNode[] {
    if (!this.match("lbrace")) {
      this.error(this.peek(), "EXPECTED_BLOCK", "Se esperaba un bloque.");
      return [];
    }
    return this.parseStatements(true);
  }

  private lineValues(): string[] {
    const values: string[] = [];
    while (!this.check("newline") && !this.check("rbrace") && !this.check("eof")) values.push(this.advance().value);
    return values;
  }

  private consumeValue(code: string, message: string): Token {
    if (["word", "number", "duration"].includes(this.peek().type)) return this.advance();
    this.error(this.peek(), code, message);
    return { type: "word", value: "", loc: this.peek().loc };
  }
  private sync() { while (!this.check("newline") && !this.check("rbrace") && !this.check("eof")) this.advance(); }
  private error(token: Token, code: string, message: string) { this.diagnostics.push(diagnostic(code, message, token.loc.line, token.loc.column)); }
  private peek() { return this.tokens[this.index]; }
  private check(type: TokenType) { return this.peek().type === type; }
  private match(type: TokenType) { if (!this.check(type)) return false; this.advance(); return true; }
  private advance() { return this.tokens[this.index++]; }
}

export function parseDSL(source: string): ParseResult {
  const parser = new Parser(tokenize(source));
  return { ast: parser.parse(), diagnostics: parser.diagnostics };
}
