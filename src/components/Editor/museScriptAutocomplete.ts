import {
  autocompletion,
  snippetCompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
} from "@codemirror/autocomplete";

const instruments = ["Synth", "AMSynth", "FMSynth", "PolySynth", "MembraneSynth"];
const durations = ["1", "1/2", "1/4", "1/8", "1/16", "1/32"];
const subdivisions = ["1m", "2m", "3m", "4m", "1n", "2n", "4n", "8n", "16n", "32n"];
const scales = ["major", "minor", "ionian", "aeolian", "dorian", "phrygian", "lydian", "mixolydian", "locrian"];
const romans = ["I", "ii", "iii", "IV", "V", "vi", "vii°", "i", "III", "VI", "VII"];
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "C#4", "Bb4"];
const chordNames = ["CM", "Dm", "Em", "FM", "GM", "Am", "Cmaj7", "G7"];
const patterns = ["x---x---x---x---", "x-x-", "xxxxxxxx", "x-x-[xx]", "x---x---x---x---", "x-Rx-xR-"];

const option = (label: string, type: string, detail: string, info?: string): Completion => ({
  label,
  type,
  detail,
  info: info ?? detail,
});

const valueOptions = (values: string[], type: string, detail: string): Completion[] =>
  values.map((value) => option(value, type, detail));

const commandOptions: Completion[] = [
  snippetCompletion("tempo ${120}", option("tempo", "keyword", "Configurar BPM", "Rango válido: 30–300 BPM.")),
  snippetCompletion("instrument ${PolySynth}", option("instrument", "keyword", "Elegir instrumento")),
  snippetCompletion("volume ${-12}", option("volume", "keyword", "Configurar volumen", "Rango válido: -60 a 12 dB.")),
  snippetCompletion("channel ${name} {\n  instrument ${PolySynth}\n  volume ${-12}\n  ${}\n}", option("channel", "class", "Crear canal")),
  snippetCompletion(
    "clip ${name} {\n  notes ${C4 E4 G4}\n  pattern ${x-x-}\n  subdiv ${8n}\n}\n\nplay ${name}",
    option("clip", "class", "Crear y reproducir clip"),
  ),
  snippetCompletion("pattern ${name} {\n  ${C4 1/4}\n}\n\nplay ${name}", option("pattern", "class", "Crear sección nombrada")),
  snippetCompletion("loop ${4} {\n  ${C4 1/8}\n}", option("loop", "keyword", "Repetir secuencia")),
  snippetCompletion("play ${name}", option("play", "keyword", "Reproducir clip o pattern")),
  snippetCompletion("rest ${1/4}", option("rest", "keyword", "Añadir silencio")),
  snippetCompletion("chord ${C4} ${M} ${1/2}", option("chord", "function", "Añadir acorde nombrado")),
];

function definitions(source: string): Completion[] {
  const names = new Set<string>();
  for (const match of source.matchAll(/^\s*(?:clip|pattern)\s+([A-Za-z_][\w-]*)/gm)) names.add(match[1]);
  return [...names].map((name) => option(name, "variable", "Definido en esta composición"));
}

function result(from: number, options: Completion[]): CompletionResult {
  return { from, options, validFor: /[\w#b/+\-°]*/ };
}

export function museScriptCompletionSource(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/[\w#b/+\-°]*/);
  if (!word || (!context.explicit && !word.text)) return null;

  const line = context.state.doc.lineAt(context.pos);
  const beforeWord = line.text.slice(0, word.from - line.from).trim();
  const fullLine = line.text.slice(0, context.pos).trim();
  const source = context.state.doc.toString();

  if (/^instrument\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(instruments, "type", "Instrumento Tone.js"));
  }
  if (/^tempo\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(["82", "96", "104", "120", "126", "138"], "constant", "BPM sugerido"));
  }
  if (/^volume\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(["-20", "-18", "-16", "-14", "-12", "-8", "-6", "-2", "0"], "constant", "Volumen en dB"));
  }
  if (/^subdiv\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(subdivisions, "constant", "Subdivisión del clip"));
  }
  if (/^play\s*$/.test(beforeWord)) {
    return result(word.from, definitions(source));
  }
  if (/^(?:rest|(?:[A-G](?:#|b)?[0-8]))\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(durations, "constant", "Duración musical"));
  }
  if (/^chord\s+[A-G](?:#|b)?[0-8]\s+[A-Za-z0-9#+]*\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(durations, "constant", "Duración del acorde"));
  }
  if (/^chord\s+[A-G](?:#|b)?[0-8]\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(["M", "m", "maj7", "m7", "7", "m7b5"], "enum", "Calidad del acorde"));
  }
  if (/^chord\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(notes, "constant", "Raíz del acorde"));
  }
  if (/^notes\s*$/.test(beforeWord)) {
    return result(word.from, [
      ...valueOptions(["scale", "progression", "arp"], "function", "Generador teórico"),
      ...valueOptions(notes, "constant", "Nota"),
    ]);
  }
  if (/^notes\s+scale\s*$/.test(beforeWord) || /^notes\s+progression\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(notes, "constant", "Tónica con octava"));
  }
  if (/^notes\s+scale\s+[A-G](?:#|b)?[0-8]\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(scales, "enum", "Nombre de escala"));
  }
  if (/^notes\s+progression\s+[A-G](?:#|b)?[0-8]\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(scales, "enum", "Modo de la progresión"));
  }
  if (/^notes\s+progression\s+[A-G](?:#|b)?[0-8]\s+\w+\s/.test(fullLine)) {
    return result(word.from, valueOptions(romans, "enum", "Grado armónico"));
  }
  if (/^notes\s+arp\s/.test(fullLine)) {
    return result(word.from, valueOptions(chordNames, "constant", "Acorde para arpegio"));
  }
  if (/^notes\s+/.test(fullLine)) {
    return result(word.from, valueOptions(notes, "constant", "Nota del clip"));
  }
  if (/^pattern\s*$/.test(beforeWord)) {
    return result(word.from, valueOptions(patterns, "text", "Pattern rítmico"));
  }
  if (/^\s*$/.test(beforeWord) || /^[A-Za-z_][\w-]*$/.test(word.text)) {
    return result(word.from, commandOptions);
  }
  return null;
}

export const museScriptAutocomplete = autocompletion({
  override: [museScriptCompletionSource],
  activateOnTyping: true,
  icons: true,
  maxRenderedOptions: 12,
});
