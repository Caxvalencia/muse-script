import { describe, expect, it } from "vitest";
import { validateScribblePattern } from "../dsl/scribblePattern";

describe("Scribbletune patterns", () => {
  it("accepts supported syntax", () => expect(validateScribblePattern("x-x-[xR]_")).toBeNull());
  it("rejects invalid and unbalanced syntax", () => {
    expect(validateScribblePattern("x.o")).toBeTruthy();
    expect(validateScribblePattern("x-[xx")).toBeTruthy();
  });
});
