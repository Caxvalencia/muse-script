import { describe, expect, it } from "vitest";
import { parseDSL } from "../dsl/parser";

describe("parser", () => {
  it("parses tempo, notes, chords, loops, patterns and channels", () => {
    const result = parseDSL(`tempo 120
[C4 E4 G4] 1/2
loop 2 { C4 1/8 }
pattern intro { D4 1/4 }
channel lead {
  instrument FMSynth
  clip riff {
    notes C4 E4 G4
    pattern x-x-[xx]
    subdiv 8n
  }
  play riff
}`);
    expect(result.diagnostics).toEqual([]);
    expect(result.ast.body.map((node) => node.type)).toEqual(["Tempo", "Chord", "Loop", "Pattern", "Channel"]);
    const channel = result.ast.body[4];
    expect(channel.type === "Channel" && channel.body[1].type).toBe("Clip");
  });

  it("returns diagnostics instead of throwing", () => {
    const result = parseDSL("wat nope\nloop 2 { C4 1/4");
    expect(result.diagnostics.map((item) => item.code)).toContain("UNKNOWN_COMMAND");
    expect(result.diagnostics.map((item) => item.code)).toContain("UNCLOSED_BLOCK");
  });
});
