import {
  HighlightStyle,
  StreamLanguage,
  syntaxHighlighting,
  type StreamParser,
  type StringStream,
} from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

type ExpectedToken = "definition" | "reference" | "instrument" | "pattern" | "tempo" | null;

interface MuseScriptHighlightState {
  expected: ExpectedToken;
  notesLine: boolean;
  theoryLine: boolean;
}

const DEFINITION_KEYWORDS = new Set(["channel", "clip"]);
const CONTROL_KEYWORDS = new Set(["play", "loop"]);
const CONFIG_KEYWORDS = new Set(["tempo", "instrument"]);
const CLIP_PROPERTIES = new Set(["notes", "subdiv", "chords", "count", "order"]);
const THEORY_KEYWORDS = new Set(["scale", "progression", "arp", "chord"]);
const INSTRUMENTS = new Set(["Synth", "AMSynth", "FMSynth", "PolySynth", "MembraneSynth"]);
const SCALE_NAMES = new Set(["major", "minor", "ionian", "aeolian", "dorian", "phrygian", "lydian", "mixolydian", "locrian"]);

const NOTE = /^(?:C|C#|Db|D|D#|Eb|E|F|F#|Gb|G|G#|Ab|A|A#|Bb|B)[0-8]$/;
const CHORD_NAME = /^(?:[A-G](?:#|b)?)(?:M|m|maj7|m7|M7|m7b5|M#5)?(?:_\d)?$/;
const ROMAN = /^(?:I|II|III|IV|V|VI|VII|i|ii|iii|iv|v|vi|vii)(?:°|\+|7)?$/;
const DURATION = /^1(?:\/(?:2|4|8|16|32))?$/;
const SUBDIVISION = /^(?:[1-4]m|1n|2n|4n|8n|16n|32n)$/;
const PATTERN = /^[xR\-_\[\]]+$/;

const parser: StreamParser<MuseScriptHighlightState> = {
  name: "MuseScript",
  startState: () => ({ expected: null, notesLine: false, theoryLine: false }),
  tokenTable: {
    museDefinition: tags.definition(tags.variableName),
    museReference: tags.labelName,
    museInstrument: tags.typeName,
    museNote: tags.atom,
    museDuration: tags.unit,
    musePattern: tags.regexp,
    museTheory: tags.special(tags.keyword),
    museScale: tags.className,
    museRoman: tags.bool,
  },
  token(stream: StringStream, state: MuseScriptHighlightState): string | null {
    if (stream.sol()) {
      state.expected = null;
      state.notesLine = false;
      state.theoryLine = false;
    }
    if (stream.eatSpace()) return null;
    if (stream.match("//")) {
      stream.skipToEnd();
      return "lineComment";
    }
    if (stream.match(/[{}\[\]]/)) return "bracket";

    const match = stream.match(/[^\s{}\[\]]+/);
    if (!match || typeof match === "boolean") {
      stream.next();
      return null;
    }
    const word = match[0];

    if (state.expected) {
      const expected = state.expected;
      state.expected = null;
      if (expected === "definition") return "museDefinition";
      if (expected === "reference") return "museReference";
      if (expected === "instrument") return INSTRUMENTS.has(word) ? "museInstrument" : "invalid";
      if (expected === "pattern") return PATTERN.test(word) ? "musePattern" : "invalid";
      if (expected === "tempo") return /^\d+$/.test(word) ? "number" : "invalid";
    }

    if (word === "pattern") {
      const isNamedPattern = /^[A-Za-z_][\w-]*\s*\{/.test(stream.string.slice(stream.pos).trim());
      state.expected = isNamedPattern ? "definition" : "pattern";
      return isNamedPattern ? "definitionKeyword" : "propertyName";
    }
    if (DEFINITION_KEYWORDS.has(word)) {
      state.expected = "definition";
      return "definitionKeyword";
    }
    if (word === "play") {
      state.expected = "reference";
      return "controlKeyword";
    }
    if (word === "instrument") {
      state.expected = "instrument";
      return "keyword";
    }
    if (word === "tempo") {
      state.expected = "tempo";
      return "keyword";
    }
    if (word === "notes") {
      state.notesLine = true;
      return "propertyName";
    }
    if (word === "subdiv") return "propertyName";
    if (CLIP_PROPERTIES.has(word)) return "propertyName";
    if (CONTROL_KEYWORDS.has(word)) return "controlKeyword";
    if (CONFIG_KEYWORDS.has(word)) return "keyword";
    if (word === "rest") return "controlKeyword";
    if (THEORY_KEYWORDS.has(word)) {
      state.theoryLine = true;
      return "museTheory";
    }
    if (INSTRUMENTS.has(word)) return "museInstrument";
    if (NOTE.test(word)) return "museNote";
    if (DURATION.test(word) || SUBDIVISION.test(word)) return "museDuration";
    if (ROMAN.test(word) && state.theoryLine) return "museRoman";
    if (SCALE_NAMES.has(word) && state.theoryLine) return "museScale";
    if (CHORD_NAME.test(word) && (state.notesLine || state.theoryLine)) return "string";
    if (PATTERN.test(word)) return "musePattern";
    if (/^\d+$/.test(word)) return "number";
    return "variableName";
  },
  languageData: {
    commentTokens: { line: "//" },
    closeBrackets: { brackets: ["(", "[", "{", "'", '"'] },
  },
};

export const museScriptLanguage = StreamLanguage.define(parser);

const museScriptHighlightStyle = HighlightStyle.define([
  { tag: tags.lineComment, color: "#687080", fontStyle: "italic" },
  { tag: tags.keyword, color: "#c792ea", fontWeight: "600" },
  { tag: tags.definitionKeyword, color: "#ff7ab2", fontWeight: "700" },
  { tag: tags.controlKeyword, color: "#ff9e64", fontWeight: "600" },
  { tag: tags.propertyName, color: "#7dcfff" },
  { tag: tags.definition(tags.variableName), color: "#f5d76e", fontWeight: "700" },
  { tag: tags.labelName, color: "#f5d76e" },
  { tag: tags.typeName, color: "#bb9af7" },
  { tag: tags.atom, color: "#73daca", fontWeight: "600" },
  { tag: tags.unit, color: "#e0af68" },
  { tag: tags.regexp, color: "#ff9e64", letterSpacing: "0.04em" },
  { tag: tags.special(tags.keyword), color: "#2ac3de", fontWeight: "600" },
  { tag: tags.className, color: "#9ece6a" },
  { tag: tags.bool, color: "#f7768e", fontWeight: "600" },
  { tag: tags.string, color: "#9ece6a" },
  { tag: tags.number, color: "#e0af68" },
  { tag: tags.bracket, color: "#89ddff", fontWeight: "700" },
  { tag: tags.variableName, color: "#c0caf5" },
  { tag: tags.invalid, color: "#ff5370", textDecoration: "underline wavy" },
]);

const museScriptEditorTheme = EditorView.theme(
  {
    "&": {
      color: "#c0caf5",
      backgroundColor: "#0d0e13",
    },
    ".cm-content": {
      caretColor: "#c099ff",
      padding: "12px 0 40px",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#c099ff",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
      backgroundColor: "#4f3b6d99",
    },
    ".cm-activeLine": {
      backgroundColor: "#171923",
    },
    ".cm-activeLineGutter": {
      color: "#e5d5ff",
      backgroundColor: "#262936",
    },
    ".cm-gutters": {
      color: "#687080",
      backgroundColor: "#0d0e13",
      borderRight: "1px solid #252733",
    },
    ".cm-matchingBracket": {
      color: "#ffffff",
      backgroundColor: "#55456f",
      outline: "1px solid #9d7bc7",
    },
  },
  { dark: true },
);

export const museScriptEditorExtensions = [
  museScriptLanguage,
  syntaxHighlighting(museScriptHighlightStyle),
  museScriptEditorTheme,
];
