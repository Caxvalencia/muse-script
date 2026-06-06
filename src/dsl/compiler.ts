import type {
  ClipNode,
  NotesExpression,
  ProgramNode,
  StatementNode,
} from "./ast";
import { diagnostic, type Diagnostic } from "./diagnostics";
import { durationSteps, durationToSubdiv, isDuration } from "./duration";
import { isValidInstrument, isValidNote } from "./notes";
import { validateScribblePattern } from "./scribblePattern";
import type {
  CompiledChannel,
  CompiledClip,
  CompiledSong,
  MusicEvent,
} from "../music/types";

const SUBDIVS = ["1m", "2m", "3m", "4m", "1n", "2n", "4n", "8n", "16n", "32n"];

export function compile(ast: ProgramNode): CompiledSong {
  const diagnostics: Diagnostic[] = [];
  let tempo = 120;
  let globalInstrument = "PolySynth";
  let globalVolume = 0;
  const rootStatements: StatementNode[] = [];
  const channels: CompiledChannel[] = [];
  const seenChannels = new Set<string>();

  for (const statement of ast.body) {
    if (statement.type === "Tempo") {
      if (
        !Number.isFinite(statement.bpm) ||
        statement.bpm < 30 ||
        statement.bpm > 300
      )
        add(
          diagnostics,
          statement,
          "INVALID_TEMPO",
          "El tempo debe estar entre 30 y 300 BPM.",
        );
      else tempo = statement.bpm;
    } else if (statement.type === "Instrument") {
      if (!isValidInstrument(statement.name))
        add(
          diagnostics,
          statement,
          "UNKNOWN_INSTRUMENT",
          `Instrumento desconocido "${statement.name}".`,
        );
      else globalInstrument = statement.name;
    } else if (statement.type === "Volume") {
      if (!isValidVolume(statement.db))
        add(
          diagnostics,
          statement,
          "INVALID_VOLUME",
          "El volumen debe estar entre -60 y 12 dB.",
        );
      else globalVolume = statement.db;
    } else if (statement.type === "Channel") {
      if (seenChannels.has(statement.name))
        add(
          diagnostics,
          statement,
          "DUPLICATE_CHANNEL",
          `Canal duplicado "${statement.name}".`,
        );
      seenChannels.add(statement.name);
      channels.push(
        compileChannel(
          statement.name,
          statement.body,
          globalInstrument,
          globalVolume,
          diagnostics,
        ),
      );
    } else rootStatements.push(statement);
  }
  if (rootStatements.length)
    channels.unshift(
      compileChannel("main", rootStatements, globalInstrument, globalVolume, diagnostics),
    );
  if (!channels.length)
    channels.push({ name: "main", instrument: globalInstrument, volume: globalVolume, clips: [] });
  
  return { tempo, channels, diagnostics };
}

function compileChannel(
  name: string,
  statements: StatementNode[],
  inheritedInstrument: string,
  inheritedVolume: number,
  diagnostics: Diagnostic[],
): CompiledChannel {
  let instrument = inheritedInstrument;
  let volume = inheritedVolume;
  const patterns = new Map<string, StatementNode[]>();
  const clips = new Map<string, CompiledClip>();
  const plays: StatementNode[] = [];
  const loose: StatementNode[] = [];

  for (const statement of statements) {
    if (statement.type === "Instrument") {
      if (!isValidInstrument(statement.name))
        add(
          diagnostics,
          statement,
          "UNKNOWN_INSTRUMENT",
          `Instrumento desconocido "${statement.name}".`,
        );
      else instrument = statement.name;
    } else if (statement.type === "Volume") {
      if (!isValidVolume(statement.db))
        add(
          diagnostics,
          statement,
          "INVALID_VOLUME",
          "El volumen debe estar entre -60 y 12 dB.",
        );
      else volume = statement.db;
    } else if (statement.type === "Pattern") {
      if (patterns.has(statement.name))
        add(
          diagnostics,
          statement,
          "DUPLICATE_PATTERN",
          `Pattern duplicado "${statement.name}".`,
        );
      patterns.set(statement.name, statement.body);
    } else if (statement.type === "Clip") {
      if (clips.has(statement.name))
        add(
          diagnostics,
          statement,
          "DUPLICATE_CLIP",
          `Clip duplicado "${statement.name}".`,
        );
      clips.set(statement.name, compileClip(statement, diagnostics));
    } else if (statement.type === "Play") plays.push(statement);
    else loose.push(statement);
  }
  if (loose.length)
    clips.set(
      "sequence",
      compileEventsClip(
        "sequence",
        expandLoops(loose, diagnostics),
        diagnostics,
        true,
      ),
    );
  for (const play of plays) {
    if (play.type !== "Play") continue;
    const clip = clips.get(play.name);
    if (clip) clip.play = true;
    else if (patterns.has(play.name))
      clips.set(
        play.name,
        compileEventsClip(
          play.name,
          expandLoops(patterns.get(play.name)!, diagnostics),
          diagnostics,
          true,
        ),
      );
    else
      add(
        diagnostics,
        play,
        "UNKNOWN_PATTERN",
        `No existe el pattern o clip "${play.name}".`,
      );
  }
  const result = [...clips.values()];
  if (!result.some((clip) => clip.play) && result.length) result[0].play = true;
  if (!result.length)
    diagnostics.push(
      diagnostic(
        "EMPTY_CHANNEL",
        `El canal "${name}" no tiene clips reproducibles.`,
        1,
        1,
        "warning",
      ),
    );
  return { name, instrument, volume, clips: result };
}

function isValidVolume(db: number): boolean {
  return Number.isFinite(db) && db >= -60 && db <= 12;
}

function compileClip(node: ClipNode, diagnostics: Diagnostic[]): CompiledClip {
  const notesProp = node.properties.find((p) => p.type === "NotesProperty");
  const patternProp = node.properties.find(
    (p) => p.type === "ScribblePatternProperty",
  );
  const subdivProp = node.properties.find((p) => p.type === "SubdivProperty");
  const durProp = node.properties.find((p) => p.type === "DurProperty");
  const randomNotesProp = node.properties.find((p) => p.type === "RandomNotesProperty");
  const notes =
    notesProp?.type === "NotesProperty"
      ? resolveNotes(notesProp.value, node, diagnostics)
      : [];
  const pattern =
    patternProp?.type === "ScribblePatternProperty"
      ? patternProp.value
      : "x".repeat(Math.max(notes.length, 1));
  const subdiv =
    subdivProp?.type === "SubdivProperty" ? subdivProp.value : "4n";
  const dur = durProp?.type === "DurProperty" ? durProp.value : undefined;
  const randomNotes =
    randomNotesProp?.type === "RandomNotesProperty"
      ? resolveNotes(randomNotesProp.value, node, diagnostics)
      : undefined;
  const patternError = validateScribblePattern(pattern);
  if (patternError)
    add(diagnostics, node, "INVALID_SCRIBBLE_PATTERN", patternError);
  if (!SUBDIVS.includes(subdiv))
    add(
      diagnostics,
      node,
      "INVALID_SUBDIV",
      `Subdivisión inválida "${subdiv}".`,
    );
  if (dur && !SUBDIVS.includes(dur))
    add(
      diagnostics,
      node,
      "INVALID_DURATION",
      `Duración inválida "${dur}".`,
    );
  if (!notes.length)
    add(
      diagnostics,
      node,
      "INVALID_NOTES",
      `El clip "${node.name}" no contiene notas válidas.`,
    );
  return { name: node.name, notes, pattern, subdiv, dur, randomNotes, play: false };
}

function resolveNotes(
  expr: NotesExpression,
  node: StatementNode,
  diagnostics: Diagnostic[],
): string[] {
  if (expr.kind === "notes") {
    expr.values.forEach((note) => {
      if (!isValidNote(note))
        add(
          diagnostics,
          node,
          "INVALID_NOTE",
          `La nota "${note}" no es válida.`,
        );
    });
    return expr.values.filter(isValidNote);
  }
  // Theory expressions are resolved by Scribbletune in the music adapter.
  if (expr.kind === "scale") return [`@scale:${expr.tonic} ${expr.scale}`];
  if (expr.kind === "progression")
    return [
      `@progression:${expr.tonic} ${expr.scale}|${expr.degrees.join(" ")}`,
    ];
  return [`@arp:${expr.chords}|${expr.count ?? ""}|${expr.order ?? ""}`];
}

function expandLoops(
  statements: StatementNode[],
  diagnostics: Diagnostic[],
): StatementNode[] {
  const output: StatementNode[] = [];
  for (const statement of statements) {
    if (statement.type !== "Loop") output.push(statement);
    else if (
      !Number.isInteger(statement.count) ||
      statement.count <= 0 ||
      statement.count > 64
    )
      add(
        diagnostics,
        statement,
        "INVALID_LOOP",
        "Loop debe ser un entero entre 1 y 64.",
      );
    else
      for (let i = 0; i < statement.count; i++)
        output.push(...expandLoops(statement.body, diagnostics));
  }
  return output;
}

function compileEventsClip(
  name: string,
  statements: StatementNode[],
  diagnostics: Diagnostic[],
  play: boolean,
): CompiledClip {
  const events: MusicEvent[] = [];
  let step = 0;
  for (const statement of statements) {
    if (!["Note", "Rest", "Chord", "NamedChord"].includes(statement.type)) {
      add(
        diagnostics,
        statement,
        "INVALID_SEQUENCE_STATEMENT",
        "Este comando no puede usarse dentro de una secuencia.",
      );
      continue;
    }
    const duration = "duration" in statement ? statement.duration : "1/4";
    if (statement.type === "Note" && !isValidNote(statement.note)) {
      add(
        diagnostics,
        statement,
        "INVALID_NOTE",
        `La nota "${statement.note}" no es válida.`,
      );
    }
    if (statement.type === "Chord") {
      statement.notes.forEach((note) => {
        if (!isValidNote(note))
          add(
            diagnostics,
            statement,
            "INVALID_NOTE",
            `La nota "${note}" no es válida.`,
          );
      });
    }
    if (!isDuration(duration)) {
      add(
        diagnostics,
        statement,
        "INVALID_DURATION",
        `Duración inválida "${duration}".`,
      );
      continue;
    }
    if (statement.type === "Note") {
      if (isValidNote(statement.note))
        events.push({
          type: "note",
          notes: [statement.note],
          duration: durationToSubdiv(duration)!,
          startStep: step,
        });
    } else if (statement.type === "Rest")
      events.push({
        type: "rest",
        notes: [],
        duration: durationToSubdiv(duration)!,
        startStep: step,
      });
    else if (statement.type === "Chord") {
      events.push({
        type: "chord",
        notes: statement.notes.filter(isValidNote),
        duration: durationToSubdiv(duration)!,
        startStep: step,
      });
    } else if (statement.type === "NamedChord") {
      events.push({
        type: "chord",
        notes: [`@chord:${statement.root} ${statement.quality}`],
        duration: durationToSubdiv(duration)!,
        startStep: step,
      });
    }
    step += durationSteps(duration);
  }
  const finest = Math.max(
    ...events
      .map((event) => Number(event.duration.replace("n", "")))
      .filter(Boolean),
    4,
  );
  const subdiv = `${finest}n`;
  const notes = events.flatMap((event) => event.notes);
  const unit = 32 / finest;
  const pattern = events
    .map((event) => {
      const length = Math.max(1, durationToUnits(event.duration, unit));
      return event.type === "rest"
        ? "-".repeat(length)
        : `x${"_".repeat(length - 1)}`;
    })
    .join("");
  return { name, notes, pattern: pattern || "-", subdiv, events, play };
}

function durationToUnits(duration: string, unit: number): number {
  const denominator = Number(duration.replace("n", ""));
  return 32 / denominator / unit;
}

function add(
  diagnostics: Diagnostic[],
  node: { loc: { line: number; column: number } },
  code: string,
  message: string,
) {
  diagnostics.push(diagnostic(code, message, node.loc.line, node.loc.column));
}
