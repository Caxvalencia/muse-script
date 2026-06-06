import * as Tone from "tone";
import { createInstrument } from "../instruments";
import type { MusicEngine } from "../ports/MusicEngine";
import type { CompiledSong } from "../types";

type Instrument = ReturnType<typeof createInstrument>;

export class ToneFallbackEngine implements MusicEngine {
  protected song: CompiledSong | null = null;
  private instruments: Instrument[] = [];
  private sequences: Array<Tone.Sequence | Tone.Part> = [];

  async init() {
    await Tone.start();
  }

  async load(song: CompiledSong) {
    this.stop();
    this.disposeNodes();
    this.song = song;
    this.setTempo(song.tempo);

    for (const channel of song.channels) {
      const instrument = createInstrument(channel.instrument);
      this.instruments.push(instrument);
      for (const clip of channel.clips.filter((candidate) => candidate.play)) {
        if (clip.events?.length) {
          const ticksPerStep = Tone.Transport.PPQ * 4 / 32;
          const events = clip.events.map((event) => ({
            time: `${event.startStep * ticksPerStep}i`,
            notes: event.notes,
            duration: event.duration,
            rest: event.type === "rest",
          }));
          const part = new Tone.Part((time, event) => {
            if (!event.rest && event.notes.length) instrument.trigger(event.notes, event.duration, time);
          }, events).start(0);
          part.loop = true;
          part.loopEnd = Math.max(...clip.events.map((event) => event.startStep + 1)) * Tone.Transport.PPQ * 4 / 32;
          this.sequences.push(part);
        } else {
          const notes = clip.notes.filter((note) => typeof note !== "string" || !note.startsWith("@"));
          let noteIndex = 0;
          const sequence = new Tone.Sequence((time, symbol: string) => {
            if ((symbol === "x" || symbol === "R") && notes.length) {
              const note = symbol === "R" ? notes[Math.floor(Math.random() * notes.length)] : notes[noteIndex++ % notes.length];
              instrument.trigger(Array.isArray(note) ? note : [note], clip.subdiv, time);
            }
          }, flattenPattern(clip.pattern), clip.subdiv as Tone.Unit.Time).start(0);
          sequence.loop = true;
          this.sequences.push(sequence);
        }
      }
    }
  }

  async play() {
    await this.init();
    Tone.getTransport().start();
  }

  stop() {
    Tone.getTransport().stop();
    Tone.getTransport().position = 0;
    this.instruments.forEach((instrument) => instrument.release());
  }

  async restart() {
    this.stop();
    await this.play();
  }

  setTempo(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
  }

  dispose() {
    this.stop();
    this.disposeNodes();
    this.song = null;
  }

  private disposeNodes() {
    this.sequences.forEach((sequence) => sequence.dispose());
    this.instruments.forEach((instrument) => instrument.dispose());
    this.sequences = [];
    this.instruments = [];
    Tone.getTransport().cancel();
  }
}

function flattenPattern(pattern: string): string[] {
  return pattern.replace(/[\[\]]/g, "").split("");
}
