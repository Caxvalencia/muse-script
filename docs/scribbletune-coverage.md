# Cobertura de Scribbletune

MuseScript usa Scribbletune como capa de teoría musical y adopta parte de su
modelo de clips. Esta tabla registra qué está disponible y qué falta.

## Soportado

| Scribbletune | MuseScript |
| --- | --- |
| `scale()` / modes | `notes scale C4 major` |
| `chord()` | `chord C4 M 1/2` |
| `arp()` con `count` y `order` | `arp { chords ... count ... order ... }` |
| `getChordsByProgression()` | `notes progression C4 major I V vi IV` |
| `pattern` con `x`, `-`, `_`, `R`, `[ ]` | Validación y reproducción básica |
| `subdiv` | `subdiv 16n` |
| `randomNotes` | `randomNotes scale D2 minor` o notas explícitas |
| `dur` | `dur 32n` |
| volumen de canal | `volume -14` |

## Parcial

| Funcionalidad | Estado actual | Mejora necesaria |
| --- | --- | --- |
| `_` sustain | Se valida, pero no extiende la nota anterior | Generar eventos con duración acumulada |
| `[ ]` subdivisión | Se valida, pero se aplana al reproducir | Preservar grupos anidados en el scheduler |
| `R` aleatorio | Usa `randomNotes`, pero se elige durante reproducción | Opción de aleatoriedad determinista |
| MIDI | Exporta secuencias explícitas | Resolver clips teóricos, patterns y dinámica |
| múltiples clips por canal | Se compilan y pueden sonar juntos | Añadir selección exclusiva y cambio de clip |

## Pendiente

Prioridad alta:

- Escenas/filas de `Session`, cambio de clips y duración por escena.
- Samples de canal y clips: `sample`, `samples`, sampler y buffer.
- Semántica exacta de patterns Scribbletune para `_` y `[ ]`.
- Dinámica de clips: `amp`, `accent`, `accentLow`, `sizzle` y `sizzleReps`.

Prioridad media:

- `shuffle` y `arpegiate`.
- `align` y `alignOffset`.
- Efectos Tone.js por canal.
- Progresiones generadas mediante `progression()` y consulta de grados.
- Presets y parámetros avanzados de sintetizadores.

Prioridad baja o específica de integración:

- Salidas externas JZZ, SoundfontPlayer y WebMidi.
- Offline rendering.
- Callbacks de eventos y observadores.

La referencia de Scribbletune está disponible en
[scribbletune.com/documentation](https://scribbletune.com/documentation).
