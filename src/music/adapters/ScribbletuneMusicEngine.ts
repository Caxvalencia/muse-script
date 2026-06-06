import type { MusicEngine } from "../ports/MusicEngine";
import type { CompiledSong } from "../types";
import { ToneFallbackEngine } from "./ToneFallbackEngine";

interface ScribbleApi {
  scale(value: string): string[];
  chord(value: string): string[];
  arp(
    value: string | { chords: string; count?: number; order?: string },
  ): string[];
  getChordsByProgression(scale: string, progression: string): string;
}

export function normalizeProgressionChord(value: string): string {
  const match = value.match(/^([A-G](?:#|b)?)(.+)_(\d)$/);
  return match ? `${match[1]}${match[3]} ${match[2]}` : value;
}

export class ScribbletuneMusicEngine implements MusicEngine {
  private readonly fallback = new ToneFallbackEngine();
  private scribble: ScribbleApi | null = null;

  async init() {
    await this.fallback.init();
    if (!this.scribble)
      this.scribble = (await import("scribbletune")) as unknown as ScribbleApi;
  }

  async load(song: CompiledSong) {
    await this.init();
    const resolved = structuredClone(song);

    for (const channel of resolved.channels) {
      for (const clip of channel.clips) {
        clip.notes = clip.notes.flatMap((note) =>
          typeof note === "string" ? this.resolveClipTheory(note) : [note],
        );
        clip.randomNotes = clip.randomNotes?.flatMap((note) =>
          typeof note === "string" ? this.resolveClipTheory(note) : [note],
        );
        clip.events?.forEach((event) => {
          event.notes = event.notes.flatMap((note) =>
            this.resolveEventTheory(note),
          );
        });
      }
    }

    await this.fallback.load(resolved);
  }

  play() {
    return this.fallback.play();
  }
  stop() {
    this.fallback.stop();
  }
  restart() {
    return this.fallback.restart();
  }
  setTempo(bpm: number) {
    this.fallback.setTempo(bpm);
  }
  dispose() {
    this.fallback.dispose();
  }

  private resolveClipTheory(value: string): Array<string | string[]> {
    if (!this.scribble || !value.startsWith("@")) return [value];
    if (value.startsWith("@scale:")) return this.scribble.scale(value.slice(7));
    if (value.startsWith("@chord:")) return this.scribble.chord(value.slice(7));
    if (value.startsWith("@progression:")) {
      const [scale, degrees] = value.slice(13).split("|");
      const chords = this.scribble.getChordsByProgression(scale, degrees);
      return chords
        .split(" ")
        .map((chord) => this.scribble!.chord(normalizeProgressionChord(chord)));
    }
    if (value.startsWith("@arp:")) {
      const [chords, count, order] = value.slice(5).split("|");
      return count
        ? this.scribble.arp({ chords, count: Number(count), order })
        : this.scribble.arp(chords);
    }
    return [value];
  }

  private resolveEventTheory(value: string): string[] {
    return this.resolveClipTheory(value).flatMap((note) => note);
  }
}
