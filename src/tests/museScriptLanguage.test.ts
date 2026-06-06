import { describe, expect, it } from 'vitest';

import { museScriptLanguage } from '../components/Editor/museScriptLanguage';

describe("MuseScript editor language", () => {
  it("parses representative DSL without losing source ranges", () => {
    const source = `// demo
tempo 126
channel bass {
  instrument FMSynth
  clip pulse {
    notes C2 E2 G2
    pattern x-x-
    subdiv 16n
  }
  play pulse
}`;
    const tree = museScriptLanguage.parser.parse(source);
    expect(tree.length).toBe(source.length);
  });

  it("emits distinct syntax token categories", () => {
    const source = "tempo 120\nC4 1/4\n";
    const tree = museScriptLanguage.parser.parse(source);

    expect(tree.toString()).toContain("keyword");
    expect(tree.toString()).toContain("museNote");
    expect(tree.toString()).toContain("museDuration");
  });
});
