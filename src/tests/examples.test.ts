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
});
