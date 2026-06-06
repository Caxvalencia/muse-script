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
  events?: MusicEvent[];
  play: boolean;
}

export interface CompiledChannel {
  name: string;
  instrument: string;
  clips: CompiledClip[];
}

export interface CompiledSong {
  tempo: number;
  channels: CompiledChannel[];
  diagnostics: Diagnostic[];
}
