import { describe, expect, it } from "vitest";
import { tokenize } from "../dsl/tokenizer";

describe("tokenizer", () => {
  it("ignores comments and tracks locations", () => {
    const tokens = tokenize("// hi\ntempo 120");
    expect(tokens.filter((token) => token.value === "tempo")[0].loc).toMatchObject({ line: 2, column: 1 });
    expect(tokens.some((token) => token.value === "hi")).toBe(false);
  });
});
