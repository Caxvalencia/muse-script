import type { Diagnostic } from "../dsl/diagnostics";

export interface MusicEvent {
  type: "note" | "chord" | "rest";
  notes: string[];
  duration: string;
  startStep: number;
}

export interface CompiledClip {
  name: string;
  notes: Array<string | string[]>;
  pattern: string;
  subdiv: string;
  dur?: string;
  randomNotes?: Array<string | string[]>;
  events?: MusicEvent[];
  play: boolean;
}

export interface CompiledChannel {
  name: string;
  instrument: string;
  volume: number;
  clips: CompiledClip[];
}

export interface CompiledSong {
  tempo: number;
  channels: CompiledChannel[];
  diagnostics: Diagnostic[];
}
