import { describe, expect, it } from "vitest";
import { compile } from "../dsl/compiler";
import { parseDSL } from "../dsl/parser";

const compileSource = (source: string) => compile(parseDSL(source).ast);

describe("compiler", () => {
  it("expands loops and converts friendly notation", () => {
    const song = compileSource(`tempo 128
loop 2 {
 C4 1/4
 rest 1/4
}`);
    const clip = song.channels[0].clips[0];
    expect(song.tempo).toBe(128);
    expect(clip.events).toHaveLength(4);
    expect(clip.pattern).toBe("x-x-");
    expect(clip.subdiv).toBe("4n");
  });

  it("resolves named patterns and clips", () => {
    const song = compileSource(`pattern intro { C4 1/4 }
clip riff {
 notes C4 E4
 pattern x-[xx]
 subdiv 8n
}
play intro
play riff`);
    expect(song.diagnostics).toEqual([]);
    expect(song.channels[0].clips.filter((clip) => clip.play).map((clip) => clip.name)).toEqual(["riff", "intro"]);
  });

  it("keeps theory expressions for the Scribbletune adapter", () => {
    const song = compileSource(`clip harmony {
 notes progression C4 major I V vi IV
 pattern x---x---x---x---
 subdiv 4n
}
play harmony`);
    expect(song.channels[0].clips[0].notes[0]).toBe("@progression:C4 major|I V vi IV");
  });

  it("compiles and validates channel volume in decibels", () => {
    const song = compileSource(`volume -6
channel bass {
 volume -14
 instrument FMSynth
 C2 1/4
}`);
    expect(song.channels[0].volume).toBe(-14);

    const invalid = compileSource(`channel loud {
 volume 40
 C4 1/4
}`);
    expect(invalid.diagnostics.map((item) => item.code)).toContain("INVALID_VOLUME");
  });

  it("reports semantic errors", () => {
    const song = compileSource(`tempo 900
instrument Piano
H4 1/3
play missing`);
    expect(song.diagnostics.map((item) => item.code)).toEqual(expect.arrayContaining(["INVALID_TEMPO", "UNKNOWN_INSTRUMENT", "INVALID_NOTE", "INVALID_DURATION", "UNKNOWN_PATTERN"]));
  });
});
