import { describe, expect, it } from "vitest";
import { isValidInstrument, isValidNote } from "../dsl/notes";

describe("notes", () => {
  it("validates pitches and octaves", () => {
    expect(isValidNote("C#4")).toBe(true);
    expect(isValidNote("Bb8")).toBe(true);
    expect(isValidNote("H4")).toBe(false);
    expect(isValidNote("C9")).toBe(false);
  });

  it("validates instruments", () => {
    expect(isValidInstrument("PolySynth")).toBe(true);
    expect(isValidInstrument("Piano")).toBe(false);
  });
});
