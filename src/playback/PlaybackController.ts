import { ScribbletuneMusicEngine } from "../music/adapters/ScribbletuneMusicEngine";
import type { MusicEngine } from "../music/ports/MusicEngine";
import type { CompiledSong } from "../music/types";

export class PlaybackController {
  private readonly engine: MusicEngine = new ScribbletuneMusicEngine();
  private song: CompiledSong | null = null;

  async activate() { await this.engine.init(); }
  async load(song: CompiledSong) { this.song = song; await this.engine.load(song); }
  async play() { if (this.song) await this.engine.play(); }
  stop() { this.engine.stop(); }
  restart() { return this.engine.restart(); }
  setTempo(bpm: number) { this.engine.setTempo(bpm); }
  dispose() { this.engine.dispose(); }
}
