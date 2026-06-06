export interface MuseExample {
  name: string;
  description: string;
  code: string;
}

export const examples: MuseExample[] = [
  {
    name: "01 · Tu primera nota",
    description: "Cero: tempo, instrumento y una nota",
    code: `// Empieza aquí: una sola nota
tempo 100
instrument Synth

C4 1/4`,
  },
  {
    name: "02 · Primera melodía",
    description: "Principiante: ordena notas para crear una frase",
    code: `// Cada línea toca una nota después de la anterior
tempo 100
instrument Synth

C4 1/4
D4 1/4
E4 1/4
G4 1/2`,
  },
  {
    name: "03 · Ritmo y silencios",
    description: "Principiante: combina duraciones y rests",
    code: `// Las duraciones controlan el ritmo
tempo 105
instrument PolySynth

C4 1/4
D4 1/8
E4 1/8
rest 1/4
G4 1/2
rest 1/8
E4 1/8
C4 1/2`,
  },
  {
    name: "04 · Acordes",
    description: "Principiante: toca varias notas simultáneamente",
    code: `// Usa corchetes para tocar acordes explícitos
tempo 90
instrument PolySynth

[C4 E4 G4] 1/2
[A3 C4 E4] 1/2
[F3 A3 C4] 1/2
[G3 B3 D4] 1/2`,
  },
  {
    name: "05 · Loops",
    description: "Básico: repite una idea musical",
    code: `// loop repite todo lo que está dentro del bloque
tempo 124
instrument FMSynth

loop 4 {
  C3 1/8
  E3 1/8
  G3 1/8
  rest 1/8
}`,
  },
  {
    name: "06 · Clips y patterns",
    description: "Básico: aprende x, -, subdiv y play",
    code: `// x toca, - descansa y subdiv define la velocidad
tempo 120
instrument PolySynth

clip riff {
  notes C4 E4 G4 A4
  pattern x-x-[xx]
  subdiv 8n
}

play riff`,
  },
  {
    name: "07 · Secciones nombradas",
    description: "Intermedio: organiza una frase con pattern",
    code: `// Un pattern nombrado agrupa eventos fáciles de leer
tempo 112
instrument PolySynth

pattern intro {
  C4 1/4
  D4 1/4
  E4 1/4
  G4 1/4
}

play intro`,
  },
  {
    name: "08 · Escalas",
    description: "Intermedio: genera notas de una tonalidad",
    code: `// scale genera las notas de Do mayor
tempo 118
instrument FMSynth

clip scale_run {
  notes scale C4 major
  pattern xxxxxxx-x-x-xx
  subdiv 8n
}

play scale_run`,
  },
  {
    name: "09 · Progresiones",
    description: "Intermedio: crea armonía con grados romanos",
    code: `// I V vi IV se convierte en una progresión de acordes
tempo 96
instrument PolySynth

clip chords {
  notes progression C4 major I V vi IV
  pattern x---x---x---x---
  subdiv 4n
}

play chords`,
  },
  {
    name: "10 · Arpegios",
    description: "Avanzado: convierte acordes en líneas rápidas",
    code: `// arp separa los acordes nota por nota
tempo 132
instrument AMSynth

clip arp_line {
  notes arp CM Am FM GM
  pattern xxxxxxxxxxxxxxxx
  subdiv 16n
}

play arp_line`,
  },
  {
    name: "11 · Multi-canal",
    description: "Avanzado: combina melodía, bajo y armonía",
    code: `tempo 120

channel melody {
  instrument FMSynth
  clip lead {
    notes C4 D4 E4 G4
    pattern x-x-[xx]
    subdiv 8n
  }
  play lead
}

channel bass {
  instrument Synth
  clip low_end {
    notes C2 G2 A2 F2
    pattern x---x---x---x---
    subdiv 8n
  }
  play low_end
}

channel harmony {
  instrument PolySynth
  clip chords {
    notes progression C4 major I V vi IV
    pattern x---x---x---x---
    subdiv 4n
  }
  play chords
}`,
  },
  {
    name: "12 · MuseScript Tour",
    description: "Avanzado: integra secciones, clips y teoría musical",
    code: `// Un recorrido por las herramientas principales
tempo 110
instrument PolySynth

pattern intro {
  C4 1/4
  D4 1/4
  E4 1/4
  G4 1/4
}

clip groove {
  notes C4 E4 G4 C5
  pattern x-x-[xx]
  subdiv 8n
}

clip chords {
  notes progression C4 major I IV V ii
  pattern x---x---x---x---
  subdiv 4n
}

clip arpeggio {
  notes arp CM FM CM GM
  pattern xxxxxxxxxxxxxxxx
  subdiv 16n
}

play intro
play groove
play chords
play arpeggio`,
  },
  {
    name: "13 · Neon Circuit",
    description: "Experto: canción electrónica completa de siete canales",
    code: `// Neon Circuit: electrónica multicapa en Re menor
tempo 126

channel kick {
  instrument MembraneSynth
  clip four_on_floor {
    notes C2
    pattern x---x---x---x---
    subdiv 16n
  }
  play four_on_floor
}

channel percussion {
  instrument MembraneSynth
  clip syncopation {
    notes G2 C3 G2 D3
    pattern --x---x---x-x-xx
    subdiv 16n
  }
  play syncopation
}

channel bass {
  instrument FMSynth
  clip sub_pulse {
    notes D2 D2 C2 D2 Bb1 C2 D2 A1
    pattern x-x-x---x-x-xx--
    subdiv 16n
  }
  play sub_pulse
}

channel pads {
  instrument PolySynth
  clip night_chords {
    notes progression D3 minor i VI III VII
    pattern x---x---x---x---
    subdiv 4n
  }
  play night_chords
}

channel arpeggio {
  instrument AMSynth
  clip glass_arp {
    notes arp Dm BbM FM CM
    pattern x-xxx-xx-x-xxx-xx-xxx-xx-x-xxx-x
    subdiv 16n
  }
  play glass_arp
}

channel lead {
  instrument FMSynth
  clip neon_lead {
    notes scale D4 minor
    pattern x--x-x-Rx---x-x-x--R-xx-x---x-x-
    subdiv 16n
  }
  play neon_lead
}

channel sparkles {
  instrument Synth
  clip city_lights {
    notes D5 A4 F5 C5 E5 A5
    pattern ----x-------x-x-----x-----x-xx
    subdiv 16n
  }
  play city_lights
}`,
  },
  {
    name: "14 · Acid Dreamstate",
    description: "Experto: trance psicodélico hipnótico de ocho canales",
    code: `// Acid Dreamstate: trance psicodélico en Fa# menor
tempo 138

channel pulse {
  instrument MembraneSynth
  clip trance_kick {
    notes C2
    pattern x---x---x---x---
    subdiv 16n
  }
  play trance_kick
}

channel rolling_bass {
  instrument FMSynth
  clip acid_bass {
    notes F#2 C#3 F#2 E2 F#2 A2 E2 C#2
    pattern -xxx-xxx-xxx-xxx
    subdiv 16n
  }
  play acid_bass
}

channel deep_space {
  instrument PolySynth
  clip cosmic_chords {
    notes progression F#3 minor i VI III VII
    pattern x-------x-------x-------x-------
    subdiv 8n
  }
  play cosmic_chords
}

channel spiral {
  instrument AMSynth
  clip endless_arp {
    notes arp F#m DM AM EM
    pattern xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    subdiv 16n
  }
  play endless_arp
}

channel fractal {
  instrument FMSynth
  clip fractal_sequence {
    notes scale F#4 minor
    pattern x-Rx-xR-x--Rx-x-xR-x-Rx-x--Rx-x
    subdiv 16n
  }
  play fractal_sequence
}

channel hallucination {
  instrument Synth
  clip liquid_lead {
    notes F#5 A5 C#6 E6 A5 G#5 E5 C#5
    pattern x---x-x---R-x---x--x-R--x-x---R-
    subdiv 16n
  }
  play liquid_lead
}

channel echoes {
  instrument AMSynth
  clip distant_signals {
    notes C#6 E6 F#6 A6 B6 E7
    pattern ----x-------R-------x---x-----R--
    subdiv 16n
  }
  play distant_signals
}

channel shimmer {
  instrument Synth
  clip ultraviolet {
    notes F#6 C#7 A6 E7
    pattern -------x-------x---R-------x-x---
    subdiv 16n
  }
  play ultraviolet
}`,
  },
];
