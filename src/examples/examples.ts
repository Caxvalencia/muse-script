import { finalExample } from "./finalExample";

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
    name: "13 · Ode to Joy — Beethoven",
    description: "Dominio público: tema principal adaptado para MuseScript",
    code: `// Ode to Joy — Ludwig van Beethoven
tempo 108
instrument PolySynth

E4 1/4
E4 1/4
F4 1/4
G4 1/4
G4 1/4
F4 1/4
E4 1/4
D4 1/4
C4 1/4
C4 1/4
D4 1/4
E4 1/4
E4 1/2
D4 1/4
D4 1/2

E4 1/4
E4 1/4
F4 1/4
G4 1/4
G4 1/4
F4 1/4
E4 1/4
D4 1/4
C4 1/4
C4 1/4
D4 1/4
E4 1/4
D4 1/2
C4 1/2`,
  },
  {
    name: "14 · Für Elise — Beethoven",
    description: "Dominio público: apertura reconocible adaptada",
    code: `// Für Elise — Ludwig van Beethoven
tempo 120
instrument Synth

E5 1/16
D#5 1/16
E5 1/16
D#5 1/16
E5 1/16
B4 1/16
D5 1/16
C5 1/16
A4 1/8
rest 1/16
C4 1/16
E4 1/16
A4 1/16
B4 1/8
rest 1/16
E4 1/16
G#4 1/16
B4 1/16
C5 1/8
rest 1/16
E4 1/16
E5 1/16
D#5 1/16
E5 1/16
D#5 1/16
E5 1/16
B4 1/16
D5 1/16
C5 1/16
A4 1/8`,
  },
  {
    name: "15 · Twinkle, Twinkle, Little Star",
    description: "Tradicional: melodía infantil completa y sencilla",
    code: `// Twinkle, Twinkle, Little Star
tempo 96
instrument PolySynth

C4 1/4
C4 1/4
G4 1/4
G4 1/4
A4 1/4
A4 1/4
G4 1/2
F4 1/4
F4 1/4
E4 1/4
E4 1/4
D4 1/4
D4 1/4
C4 1/2
G4 1/4
G4 1/4
F4 1/4
F4 1/4
E4 1/4
E4 1/4
D4 1/2
G4 1/4
G4 1/4
F4 1/4
F4 1/4
E4 1/4
E4 1/4
D4 1/2
C4 1/4
C4 1/4
G4 1/4
G4 1/4
A4 1/4
A4 1/4
G4 1/2
F4 1/4
F4 1/4
E4 1/4
E4 1/4
D4 1/4
D4 1/4
C4 1/2`,
  },
  {
    name: "16 · Happy Birthday to You",
    description: "Dominio público: canción tradicional de cumpleaños",
    code: `// Happy Birthday to You
tempo 100
instrument PolySynth

G4 1/8
G4 1/8
A4 1/4
G4 1/4
C5 1/4
B4 1/2
G4 1/8
G4 1/8
A4 1/4
G4 1/4
D5 1/4
C5 1/2
G4 1/8
G4 1/8
G5 1/4
E5 1/4
C5 1/4
B4 1/4
A4 1/2
F5 1/8
F5 1/8
E5 1/4
C5 1/4
D5 1/4
C5 1/2`,
  },
  {
    name: "17 · Greensleeves",
    description: "Tradicional inglesa: primera sección adaptada",
    code: `// Greensleeves — canción tradicional inglesa
tempo 92
instrument PolySynth

A4 1/4
C5 1/2
D5 1/4
E5 1/4
F5 1/2
E5 1/4
D5 1/2
B4 1/4
G4 1/2
A4 1/4
B4 1/4
C5 1/2
A4 1/4
A4 1/2
G#4 1/4
A4 1/2
B4 1/4
C5 1/2
D5 1/4
E5 1/4
F5 1/2
E5 1/4
D5 1/2
B4 1/4
G4 1/2
A4 1/4
B4 1/4
C5 1/4
B4 1/4
A4 1/2
G#4 1/4
A4 1/2`,
  },
  {
    name: "18 · Scarborough Fair",
    description: "Tradicional inglesa: melodía folk contemplativa",
    code: `// Scarborough Fair — canción tradicional inglesa
tempo 88
instrument PolySynth

D4 1/2
D4 1/4
A4 1/2
A4 1/4
E4 1/4
F4 1/4
E4 1/4
D4 1/2
rest 1/4
A4 1/2
C5 1/4
D5 1/2
C5 1/4
A4 1/4
B4 1/4
G4 1/4
A4 1/2
rest 1/4
D5 1/2
D5 1/4
C5 1/2
A4 1/4
A4 1/4
G4 1/4
F4 1/4
E4 1/2
D4 1/2`,
  },
  {
    name: "19 · Frère Jacques",
    description: "Tradicional francesa: canon sencillo y educativo",
    code: `// Frère Jacques — canción tradicional francesa
tempo 112
instrument PolySynth

pattern melody {
  C4 1/4
  D4 1/4
  E4 1/4
  C4 1/4
  C4 1/4
  D4 1/4
  E4 1/4
  C4 1/4
  E4 1/4
  F4 1/4
  G4 1/2
  E4 1/4
  F4 1/4
  G4 1/2
  G4 1/8
  A4 1/8
  G4 1/8
  F4 1/8
  E4 1/4
  C4 1/4
  G4 1/8
  A4 1/8
  G4 1/8
  F4 1/8
  E4 1/4
  C4 1/4
  C4 1/4
  G3 1/4
  C4 1/2
  C4 1/4
  G3 1/4
  C4 1/2
}

play melody`,
  },
  {
    name: "20 · Champion's Pulse",
    description: "Experto: riff original de rock motivacional de estadio",
    code: `// Champion's Pulse
// Riff original de entrenamiento con entrada dramática
tempo 112

channel arena_drums {
  instrument MembraneSynth
  clip heavy_steps {
    notes C2 G2 C2 A2
    pattern x---x---x-x-x---
    subdiv 16n
  }
  play heavy_steps
}

channel driving_bass {
  instrument FMSynth
  clip forward_motion {
    notes E2 E2 G2 A2 E2 D2 E2 B1
    pattern x-x---x-x-x---x-
    subdiv 8n
  }
  play forward_motion
}

channel power_chords {
  instrument PolySynth
  clip stadium_chords {
    notes E3 B3 E4 G3 D4 G4 A3 E4 A4
    pattern x---x---x---x---
    subdiv 4n
  }
  play stadium_chords
}

channel guitar_riff {
  instrument FMSynth
  clip champions_call {
    notes E4 G4 A4 E4 D4 E4 B3 D4 E4 G4 B4 A4 G4 E4 D4 B3
    pattern x--x-x---x-x--x-x--x-x---x-x--x-
    subdiv 16n
  }
  play champions_call
}

channel crowd_answer {
  instrument Synth
  clip rise_up {
    notes B4 E5 G5 A5 G5 E5 D5 B4
    pattern --------x---x-------x---x-------
    subdiv 16n
  }
  play rise_up
}`,
  },
  {
    name: "21 · Pixel Kingdom Run",
    description: "Experto: aventura de plataformas retro 8-bit original",
    code: `// Pixel Kingdom Run
// Tema original de plataformas retro, alegre y saltarín
tempo 152

channel jump_beat {
  instrument MembraneSynth
  clip tiny_drums {
    notes C2 G2 C2 A2
    pattern x---x-x-x---x-x-
    subdiv 16n
  }
  play tiny_drums
}

channel bouncing_bass {
  instrument Synth
  clip underground_steps {
    notes C3 G2 A2 E3 F3 C3 G2 B2
    pattern x-x-x-x-x-x-x-x-
    subdiv 8n
  }
  play underground_steps
}

channel pixel_chords {
  instrument PolySynth
  clip sunny_blocks {
    notes progression C4 major I vi IV V
    pattern x---x---x---x---
    subdiv 4n
  }
  play sunny_blocks
}

channel hero_lead {
  instrument FMSynth
  clip brave_run {
    notes E5 G5 C6 G5 A5 C6 E6 D6 B5 G5 D6 B5 C6 G5 E5 C5
    pattern xx-x-xxx-x-xx-xxx-x-xx-x-xxx-x-x
    subdiv 16n
  }
  play brave_run
}

channel sidekick {
  instrument Synth
  clip cheerful_answer {
    notes C5 E5 G5 E5 F5 A5 C6 A5 G5 B5 D6 B5 E5 G5 C6 G5
    pattern --x-x---x-x---x---x-x---x-x---x-
    subdiv 16n
  }
  play cheerful_answer
}

channel coin_sparkles {
  instrument Synth
  clip secret_rewards {
    notes C6 E6 G6 C7 A6 F6 D6 G6
    pattern -------x-------x---x-------x-x---
    subdiv 16n
  }
  play secret_rewards
}`,
  },
  {
    name: "22 · River of Grace",
    description: "Experto: folk gospel cálido, suave y con movimiento",
    code: `// River of Grace
// Folk gospel cálido para respirar, agradecer y seguir adelante
tempo 104

channel gentle_pulse {
  instrument Synth
  clip soft_steps {
    notes C3 G3 A3 F3
    pattern x-------x-------x-------x-------
    subdiv 8n
  }
  play soft_steps
}

channel upright_bass {
  instrument Synth
  clip steady_ground {
    notes C2 G2 A2 F2
    pattern x-------x-------x-------x-------
    subdiv 8n
  }
  play steady_ground
}

channel chapel {
  instrument PolySynth
  clip grace_chords {
    notes progression C3 major I V vi IV
    pattern x-------x-------x-------x-------
    subdiv 8n
  }
  play grace_chords
}

channel folk_guitar {
  instrument Synth
  clip morning_picking {
    notes C4 E4 G4 E4 G3 B3 D4 B3 A3 C4 E4 C4 F3 A3 C4 A3
    pattern x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-
    subdiv 8n
  }
  play morning_picking
}

channel hymn {
  instrument PolySynth
  clip open_road {
    notes E4 G4 A4 G4 E4 D4 C4 E4 G4 A4 C5 B4 A4 G4 E4 D4
    pattern x---x---x-------x---x---x-------x---
    subdiv 8n
  }
  play open_road
}

channel light {
  instrument PolySynth
  clip quiet_amen {
    notes C5 G5 A5 E5 F5 C5 G5 D5
    pattern --------x---------------x---------------x-------
    subdiv 8n
  }
  play quiet_amen
}`,
  },
  {
    name: "23 · Neon Circuit",
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
    name: "24 · Acid Dreamstate",
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
  {
    name: "25 · Final",
    description: "Final: sesión Scribbletune homologada con 17 canales y 73 clips",
    code: finalExample,
  },
];
