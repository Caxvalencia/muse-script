import type { CompiledSong } from "../types";

export interface MusicEngine {
  init(): Promise<void>;
  load(song: CompiledSong): Promise<void>;
  play(): Promise<void>;
  stop(): void;
  restart(): Promise<void>;
  setTempo(bpm: number): void;
  dispose(): void;
}
