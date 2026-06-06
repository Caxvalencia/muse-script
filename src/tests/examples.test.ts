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

  it("preserves supported Scribbletune clip properties in Final", () => {
    const example = examples.find((candidate) => candidate.name === "25 · Final")!;
    const song = compile(parseDSL(example.code).ast);
    const clips = Object.fromEntries(song.channels.map((channel) => [channel.name, channel.clips[0]]));

    expect(clips.Bass).toMatchObject({ dur: "32n", randomNotes: ["E2", "F2", "G2", "A2", "Bb2", "C3"] });
    expect(clips.Oh.dur).toBe("32n");
    expect(clips.Clap.dur).toBe("8n");
    expect(clips.Fx1.dur).toBe("1m");
    expect(clips.Pad.dur).toBe("2m");
  });

  it("preserves Final's non-empty scene clips and representative patterns", () => {
    const example = examples.find((candidate) => candidate.name === "25 · Final")!;
    const song = compile(parseDSL(example.code).ast);
    const channels = Object.fromEntries(song.channels.map((channel) => [channel.name, channel]));

    expect(song.channels.flatMap((channel) => channel.clips)).toHaveLength(73);
    expect(channels.Kick.clips).toHaveLength(7);
    expect(channels.Ch.clips).toHaveLength(8);
    expect(channels.Acid.clips).toHaveLength(1);
    expect(channels.Bass.clips.find((clip) => clip.name === "Bass_scene_05")).toMatchObject({
      notes: ["E2"],
      pattern: "[-xxx][-xRR]",
    });
    expect(channels.Saw.clips.find((clip) => clip.name === "Saw_scene_10")?.pattern).toBe("[xx][xx][xx][x[xx]]");
    expect(channels.WebMidi.clips.find((clip) => clip.play)?.name).toBe("WebMidi_scene_10");
  });
});
