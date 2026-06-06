import type { Diagnostic } from "./diagnostics";

export interface SourceLocation {
  line: number;
  column: number;
  offset: number;
}

interface BaseNode {
  loc: SourceLocation;
}

export interface ProgramNode extends BaseNode {
  type: "Program";
  body: StatementNode[];
}

export interface TempoNode extends BaseNode {
  type: "Tempo";
  bpm: number;
}

export interface InstrumentNode extends BaseNode {
  type: "Instrument";
  name: string;
}

export interface VolumeNode extends BaseNode {
  type: "Volume";
  db: number;
}

export interface ChannelNode extends BaseNode {
  type: "Channel";
  name: string;
  body: StatementNode[];
}

export interface ClipNode extends BaseNode {
  type: "Clip";
  name: string;
  properties: ClipPropertyNode[];
}

export interface PatternNode extends BaseNode {
  type: "Pattern";
  name: string;
  body: StatementNode[];
}

export interface PlayNode extends BaseNode {
  type: "Play";
  name: string;
}

export interface LoopNode extends BaseNode {
  type: "Loop";
  count: number;
  body: StatementNode[];
}

export interface NoteNode extends BaseNode {
  type: "Note";
  note: string;
  duration: string;
}

export interface RestNode extends BaseNode {
  type: "Rest";
  duration: string;
}

export interface ChordNode extends BaseNode {
  type: "Chord";
  notes: string[];
  duration: string;
}

export interface NamedChordNode extends BaseNode {
  type: "NamedChord";
  root: string;
  quality: string;
  duration: string;
}

export type NotesExpression =
  | { kind: "notes"; values: string[] }
  | { kind: "scale"; tonic: string; scale: string }
  | { kind: "arp"; chords: string; count?: number; order?: string }
  | { kind: "progression"; tonic: string; scale: string; degrees: string[] };

export interface NotesPropertyNode extends BaseNode {
  type: "NotesProperty";
  value: NotesExpression;
}

export interface ScribblePatternPropertyNode extends BaseNode {
  type: "ScribblePatternProperty";
  value: string;
}

export interface SubdivPropertyNode extends BaseNode {
  type: "SubdivProperty";
  value: string;
}

export type ClipPropertyNode =
  | NotesPropertyNode
  | ScribblePatternPropertyNode
  | SubdivPropertyNode;

export type StatementNode =
  | TempoNode
  | InstrumentNode
  | VolumeNode
  | ChannelNode
  | ClipNode
  | PatternNode
  | PlayNode
  | LoopNode
  | NoteNode
  | RestNode
  | ChordNode
  | NamedChordNode;

export interface ParseResult {
  ast: ProgramNode;
  diagnostics: Diagnostic[];
}
