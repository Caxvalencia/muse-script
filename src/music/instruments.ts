import * as Tone from "tone";

export interface MuseInstrument {
  trigger(notes: string[], duration: string, time: number): void;
  release(): void;
  dispose(): void;
}

export function createInstrument(name: string): MuseInstrument {
  if (name === "MembraneSynth") {
    const node = new Tone.MembraneSynth().toDestination();
    return {
      trigger: (notes, duration, time) => { if (notes[0]) node.triggerAttackRelease(notes[0], duration, time); },
      release: () => node.triggerRelease(),
      dispose: () => node.dispose(),
    };
  }
  const node = name === "AMSynth"
    ? new Tone.PolySynth(Tone.AMSynth).toDestination()
    : name === "FMSynth"
      ? new Tone.PolySynth(Tone.FMSynth).toDestination()
      : new Tone.PolySynth(Tone.Synth).toDestination();
  return {
    trigger: (notes, duration, time) => node.triggerAttackRelease(notes, duration, time),
    release: () => node.releaseAll(),
    dispose: () => node.dispose(),
  };
}
