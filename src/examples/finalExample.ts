interface FinalClip {
  scene: number;
  pattern: string;
  notes?: string;
  randomNotes?: string;
  subdiv?: string;
  dur?: string;
  arp?: { chords: string; count: number; order: string };
}

interface FinalChannel {
  name: string;
  instrument: string;
  volume: number;
  clips: FinalClip[];
}

const repeatScenes = (scenes: number[], clip: Omit<FinalClip, "scene">): FinalClip[] =>
  scenes.map((scene) => ({ scene, ...clip }));

const channels: FinalChannel[] = [
  {
    name: "Kick", instrument: "MembraneSynth", volume: -14,
    clips: repeatScenes([4, 5, 6, 7, 8, 9, 10], { notes: "C2", pattern: "xxxxxxx[xR]xxxxxxx[x--R]" }),
  },
  {
    name: "Bass", instrument: "FMSynth", volume: -16,
    clips: [
      ...[4, 7, 8, 9, 10].map((scene) => ({ scene, notes: "D2", randomNotes: "E2 F2 G2 A2 Bb2 C3", pattern: "[-xxx][-xRR]", dur: "32n" })),
      { scene: 5, notes: "E2", randomNotes: "E2 F2 G2 A2 Bb2 C3", pattern: "[-xxx][-xRR]", dur: "32n" },
      { scene: 6, notes: "D2", randomNotes: "E2 F2 G2 A2 Bb2 C3", pattern: "[-x][-R]" },
    ],
  },
  {
    name: "Ch", instrument: "MembraneSynth", volume: -12,
    clips: repeatScenes([2, 3, 4, 5, 6, 8, 9, 10], { notes: "D3", pattern: "[xx][xx][xx][x[xR]]" }),
  },
  {
    name: "Oh", instrument: "MembraneSynth", volume: -14,
    clips: repeatScenes([4, 5, 6, 9, 10], { notes: "F#3", pattern: "[-x][-[xR]]", dur: "32n" }),
  },
  {
    name: "Oh2", instrument: "MembraneSynth", volume: -18,
    clips: repeatScenes([5, 6, 9, 10], { notes: "A#3", pattern: "[-x][-R][xR][-R]", dur: "8n" }),
  },
  {
    name: "Clap", instrument: "MembraneSynth", volume: -8,
    clips: [
      { scene: 3, notes: "G3", pattern: `${"-x-x-x-[xR]".repeat(3)}-x-xxx[xx][xxxx]`, dur: "8n" },
      ...repeatScenes([4, 5, 6, 7, 10], { notes: "G3", pattern: "-x-x-x-[xR]", dur: "8n" }),
      ...repeatScenes([8, 9], { notes: "G3", pattern: `${"-x-x-x-[xR]".repeat(7)}-x-xxx[xx][xxxx]`, dur: "8n" }),
    ],
  },
  {
    name: "Acid", instrument: "FMSynth", volume: -12,
    clips: [{ scene: 5, notes: "D3", pattern: "-x-x-x-x-x-x-x-[xx]", dur: "8n" }],
  },
  {
    name: "Fx1", instrument: "Synth", volume: -6,
    clips: repeatScenes([1, 2, 3, 4, 5, 6], { notes: "D5", pattern: "----[-x]---", subdiv: "1m", dur: "1m" }),
  },
  {
    name: "Fx3", instrument: "Synth", volume: -18,
    clips: repeatScenes([1, 2, 3, 4, 5, 6], { notes: "A5", pattern: "---x", subdiv: "1m", dur: "1m" }),
  },
  {
    name: "Impact", instrument: "MembraneSynth", volume: -2,
    clips: repeatScenes([1, 4, 5, 9], { notes: "C2", pattern: "x-------", subdiv: "1m", dur: "1m" }),
  },
  {
    name: "Piano", instrument: "PolySynth", volume: -18,
    clips: repeatScenes([8, 10], {
      arp: { chords: "Dm Dm Dm BbM Am Am FM CM Dm Dm Dm BbM Gm Gm BbM CM", count: 8, order: "0245" },
      pattern: "x", subdiv: "16n", dur: "16n",
    }),
  },
  {
    name: "Saw", instrument: "AMSynth", volume: -12,
    clips: [
      { scene: 9, arp: { chords: "Dm BbM Am FM", count: 8, order: "0132" }, pattern: "x[xx][-x-x][--xx]", dur: "16n" },
      { scene: 10, arp: { chords: "Dm BbM Am FM", count: 8, order: "2143" }, pattern: "[xx][xx][xx][x[xx]]", dur: "16n" },
    ],
  },
  {
    name: "Pad", instrument: "PolySynth", volume: -20,
    clips: repeatScenes([7, 8, 10], { notes: "progression D3 minor i VI i III", pattern: "x", subdiv: "2m", dur: "2m" }),
  },
  {
    name: "Synth", instrument: "FMSynth", volume: -20,
    clips: [{ scene: 10, notes: "progression D3 minor i VI i III", pattern: "x", subdiv: "2m", dur: "2m" }],
  },
  ...["JZZ", "Soundfont", "WebMidi"].map((name): FinalChannel => ({
    name, instrument: "AMSynth", volume: -20,
    clips: [
      { scene: 8, arp: { chords: "Dm Dm Dm BbM Am Am FM CM Dm Dm Dm BbM Gm Gm BbM CM", count: 8, order: "0245" }, pattern: "x", subdiv: "16n", dur: "16n" },
      { scene: 9, arp: { chords: "Dm BbM Am FM", count: 8, order: "0132" }, pattern: "x[xx][-x-x][--xx]", dur: "16n" },
      { scene: 10, notes: "progression D3 minor i VI i III", pattern: "x", subdiv: "2m", dur: "2m" },
    ],
  })),
];

function renderClip(channel: FinalChannel, clip: FinalClip): string {
  const name = `${channel.name}_scene_${String(clip.scene).padStart(2, "0")}`;
  const source = clip.arp
    ? `    arp {
      chords ${clip.arp.chords}
      count ${clip.arp.count}
      order ${clip.arp.order}
    }`
    : `    notes ${clip.notes}`;
  return `  clip ${name} {
${source}${clip.randomNotes ? `\n    randomNotes ${clip.randomNotes}` : ""}
    pattern ${clip.pattern}
    subdiv ${clip.subdiv ?? "4n"}${clip.dur ? `\n    dur ${clip.dur}` : ""}
  }`;
}

function renderChannel(channel: FinalChannel): string {
  const clips = [...channel.clips].sort((a, b) => a.scene - b.scene);
  const finalClip = `${channel.name}_scene_${String(clips.at(-1)!.scene).padStart(2, "0")}`;
  return `channel ${channel.name} {
  instrument ${channel.instrument}
  volume ${channel.volume}

${clips.map((clip) => renderClip(channel, clip)).join("\n\n")}

  play ${finalClip}
}`;
}

export const finalExample = `// Final: homologación de la sesión original de Scribbletune
// Cada clip no vacío conserva su escena, pattern, notas, subdiv, dur y volumen.
// Se activa la última escena disponible por canal; cambia play para explorar otras.
// Samples y salidas JZZ/Soundfont/WebMidi usan sintetizadores internos equivalentes.
tempo 138

${channels.map(renderChannel).join("\n\n")}`;
