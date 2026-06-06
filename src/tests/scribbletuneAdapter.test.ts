import { describe, expect, it } from "vitest";
import { normalizeProgressionChord } from "../music/adapters/ScribbletuneMusicEngine";

describe("Scribbletune adapter", () => {
  it("normalizes progression chords to the format accepted by chord()", () => {
    expect(normalizeProgressionChord("CM_4")).toBe("C4 M");
    expect(normalizeProgressionChord("Am_4")).toBe("A4 m");
    expect(normalizeProgressionChord("F#M_5")).toBe("F#5 M");
  });
});
