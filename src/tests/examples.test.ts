import { describe, expect, it } from "vitest";
import { compile } from "../dsl/compiler";
import { parseDSL } from "../dsl/parser";
import { examples } from "../examples/examples";

describe("bundled examples", () => {
  it.each(examples.map((example) => [example.name, example.code]))(
    "%s compiles without diagnostics",
    (_name, source) => {
      const parsed = parseDSL(source);
      const song = compile(parsed.ast);
      expect([...parsed.diagnostics, ...song.diagnostics]).toEqual([]);
    },
  );

  it("preserves the original channel volumes in Final", () => {
    const example = examples.find((candidate) => candidate.name === "25 · Final");
    expect(example).toBeDefined();
    const song = compile(parseDSL(example!.code).ast);
    expect(Object.fromEntries(song.channels.map((channel) => [channel.name, channel.volume]))).toEqual({
      Kick: -14,
      Bass: -16,
      Ch: -12,
      Oh: -14,
      Oh2: -18,
      Clap: -8,
      Acid: -12,
      Fx1: -6,
      Fx3: -18,
      Impact: -2,
      Piano: -18,
      Saw: -12,
      Pad: -20,
      Synth: -20,
      JZZ: -20,
      Soundfont: -20,
      WebMidi: -20,
    });
  });
});
