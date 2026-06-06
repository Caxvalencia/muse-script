import { describe, expect, it } from "vitest";
import { durationSteps, durationToSubdiv, isDuration } from "../dsl/duration";

describe("duration", () => {
  it("validates and maps values", () => {
    expect(isDuration("1/16")).toBe(true);
    expect(isDuration("1/3")).toBe(false);
    expect(durationToSubdiv("1/8")).toBe("8n");
    expect(durationSteps("1/4")).toBe(8);
  });
});
