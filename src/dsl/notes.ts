export const NOTE_PATTERN = /^(C|C#|Db|D|D#|Eb|E|F|F#|Gb|G|G#|Ab|A|A#|Bb|B)([0-8])$/;
export const VALID_INSTRUMENTS = ["Synth", "AMSynth", "FMSynth", "PolySynth", "MembraneSynth"] as const;

export const isValidNote = (note: string): boolean => NOTE_PATTERN.test(note);
export const isValidInstrument = (name: string): boolean =>
  VALID_INSTRUMENTS.includes(name as (typeof VALID_INSTRUMENTS)[number]);
