# Referencia del DSL

El editor incluye resaltado sintáctico específico de MuseScript. Los comandos,
notas, duraciones, patterns, teoría musical, instrumentos y nombres definidos
usan colores distintos. Los tokens visualmente inválidos aparecen subrayados.

También incluye autocompletado contextual para comandos, instrumentos, notas,
duraciones, subdivisiones, teoría musical y referencias usadas por `play`.
Presiona `Ctrl+Space` para abrir las sugerencias manualmente.

## Comentarios

```txt
// Todo lo que sigue hasta el final de la línea se ignora
```

## Tempo

```txt
tempo 120
```

Rango válido: `30` a `300` BPM. El último tempo global válido define la canción.

## Instrumentos

```txt
instrument PolySynth
```

Instrumentos soportados:

| Instrumento | Uso recomendado |
| --- | --- |
| `Synth` | Leads y sonidos simples |
| `AMSynth` | Arpegios y timbres metálicos |
| `FMSynth` | Bajos y leads electrónicos |
| `PolySynth` | Acordes y pads |
| `MembraneSynth` | Kick y percusión tonal |

Un instrumento global afecta al canal principal. Dentro de `channel`, afecta
solo a ese canal.

## Notas

```txt
C4 1/4
C#4 1/8
Bb5 1/2
```

Pitch válidos: `C`, `C#`, `Db`, `D`, `D#`, `Eb`, `E`, `F`, `F#`, `Gb`, `G`,
`G#`, `Ab`, `A`, `A#`, `Bb`, `B`. Octavas válidas: `0` a `8`.

## Duraciones

| MuseScript | Tone.js | Significado |
| --- | --- | --- |
| `1` | `1n` | Redonda |
| `1/2` | `2n` | Blanca |
| `1/4` | `4n` | Negra |
| `1/8` | `8n` | Corchea |
| `1/16` | `16n` | Semicorchea |
| `1/32` | `32n` | Fusa |

## Silencios

```txt
rest 1/4
```

Los silencios solo se permiten en secuencias de eventos, no dentro de las
propiedades de un clip.

## Acordes explícitos

```txt
[C4 E4 G4] 1/2
```

Todas las notas dentro de corchetes suenan simultáneamente.

## Acordes nombrados

```txt
chord C4 M 1/2
chord A4 m 1/2
```

El acorde se resuelve mediante Scribbletune durante la carga del motor musical.

## Loops

```txt
loop 4 {
  C4 1/8
  rest 1/8
}
```

El contador debe ser un entero entre `1` y `64`.

## Patterns nombrados

```txt
pattern intro {
  C4 1/4
  E4 1/4
}

play intro
```

Son secciones de eventos de alto nivel. Dentro de ellas se permiten notas,
acordes, silencios y loops.

## Clips

```txt
clip riff {
  notes C4 E4 G4
  pattern x-x-
  subdiv 8n
}

play riff
```

Propiedades:

- `notes`: fuente de notas o expresión teórica.
- `pattern`: ritmo Scribbletune.
- `subdiv`: duración de cada paso.

Subdivisiones válidas: `1m`, `2m`, `3m`, `4m`, `1n`, `2n`, `4n`, `8n`,
`16n`, `32n`.

## Lenguaje de patterns de clips

| Símbolo | Acción |
| --- | --- |
| `x` | Toca la siguiente nota |
| `-` | Silencio |
| `_` | Sostiene el evento anterior |
| `R` | Escoge una nota aleatoria |
| `[ ]` | Agrupa una subdivisión Scribbletune |

Solo se aceptan esos caracteres y los corchetes deben estar balanceados.
Actualmente, la reproducción a través de Tone.js aplana los grupos `[ ]`.

## Escalas

```txt
clip melody {
  notes scale C4 major
  pattern xxxxxxx
  subdiv 8n
}
```

El nombre de escala se pasa a Scribbletune. Ejemplos comunes: `major`, `minor`,
`ionian`, `aeolian`, `dorian`.

## Progresiones

```txt
clip chords {
  notes progression D3 minor i VI III VII
  pattern x---x---x---x---
  subdiv 4n
}
```

Los grados romanos se convierten en acordes dentro de la escala indicada.

## Arpegios

Forma corta:

```txt
notes arp CM Am FM GM
```

Forma avanzada dentro de un clip:

```txt
arp {
  chords CM FM GM CM
  count 3
  order 102
}
```

`count` determina cuántas notas usa cada acorde y `order` su orden.

## Canales

```txt
channel melody {
  instrument FMSynth

  clip lead {
    notes C4 D4 E4 G4
    pattern x-x-[xx]
    subdiv 8n
  }

  play lead
}
```

Los nombres de canales, clips y patterns deben ser únicos dentro de su ámbito.

## Play

```txt
play intro
```

Activa un clip o pattern nombrado. Una referencia inexistente genera
`UNKNOWN_PATTERN`.

## Diagnósticos frecuentes

| Código | Significado |
| --- | --- |
| `INVALID_TEMPO` | BPM fuera del rango válido |
| `UNKNOWN_INSTRUMENT` | Instrumento no soportado |
| `INVALID_NOTE` | Pitch u octava inválida |
| `INVALID_DURATION` | Duración no soportada |
| `INVALID_LOOP` | Contador de loop inválido |
| `UNCLOSED_BLOCK` | Falta `}` |
| `UNCLOSED_CHORD` | Falta `]` |
| `DUPLICATE_CHANNEL` | Canal repetido |
| `DUPLICATE_CLIP` | Clip repetido |
| `DUPLICATE_PATTERN` | Pattern nombrado repetido |
| `INVALID_SCRIBBLE_PATTERN` | Pattern nativo inválido |
| `INVALID_SUBDIV` | Subdivisión no soportada |
| `UNKNOWN_PATTERN` | `play` apunta a un nombre inexistente |
