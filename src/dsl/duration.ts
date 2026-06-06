export const DURATIONS = ["1", "1/2", "1/4", "1/8", "1/16", "1/32"] as const;
export type MusicDuration = (typeof DURATIONS)[number];

export const isDuration = (value: string): value is MusicDuration =>
  DURATIONS.includes(value as MusicDuration);

export const durationToSubdiv = (value: string): string | null => {
  if (!isDuration(value)) return null;
  return value === "1" ? "1n" : `${value.split("/")[1]}n`;
};

export const durationSteps = (value: string, base = 32): number =>
  value === "1" ? base : base / Number(value.split("/")[1]);
