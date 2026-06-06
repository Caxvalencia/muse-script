declare module "midi-writer-js" {
  export class Track {
    setTempo(bpm: number): void;
    addEvent(event: NoteEvent): void;
  }
  export class NoteEvent {
    constructor(options: { pitch: string[]; duration: string; velocity?: number });
  }
  export class Writer {
    constructor(tracks: Track[]);
    dataUri(): string;
  }
  const MidiWriter: { Track: typeof Track; NoteEvent: typeof NoteEvent; Writer: typeof Writer };
  export default MidiWriter;
}
