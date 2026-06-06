import { CompletionContext } from "@codemirror/autocomplete";
import { EditorState } from "@codemirror/state";
import { describe, expect, it } from "vitest";
import { museScriptCompletionSource } from "../components/Editor/museScriptAutocomplete";

function suggestions(source: string): string[] {
  const state = EditorState.create({ doc: source });
  const result = museScriptCompletionSource(new CompletionContext(state, source.length, true));
  return result?.options.map((item) => item.label) ?? [];
}

describe("MuseScript autocomplete", () => {
  it("suggests top-level commands", () => {
    expect(suggestions("cha")).toContain("channel");
    expect(suggestions("cl")).toContain("clip");
  });

  it("suggests instruments and durations contextually", () => {
    expect(suggestions("instrument Pol")).toContain("PolySynth");
    expect(suggestions("C4 1/")).toContain("1/4");
    expect(suggestions("volume -")).toContain("-14");
  });

  it("suggests theory values", () => {
    expect(suggestions("notes scale C4 ma")).toContain("major");
    expect(suggestions("notes progression C4 major I V ")).toContain("vi");
    expect(suggestions("notes arp CM ")).toContain("Am");
  });

  it("suggests names defined in the document after play", () => {
    const source = "clip groove {\n notes C4\n pattern x\n subdiv 4n\n}\nplay gr";
    expect(suggestions(source)).toContain("groove");
  });
});
