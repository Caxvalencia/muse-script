# Tutorial de cero a experto

Cada sección corresponde a uno o más ejemplos disponibles en la aplicación.

## 1. Notas y tempo

```txt
tempo 100
instrument Synth

C4 1/4
E4 1/4
G4 1/2
```

Una nota combina tono, octava y duración. Las líneas se reproducen en orden.

## 2. Silencios y duraciones

```txt
C4 1/8
rest 1/8
E4 1/4
G4 1/2
```

`rest` reserva tiempo sin emitir sonido. Usa duraciones cortas para ritmos
rápidos y largas para notas sostenidas.

## 3. Acordes

```txt
[C4 E4 G4] 1/2
[A3 C4 E4] 1/2
```

Los corchetes agrupan notas que suenan simultáneamente.

## 4. Loops

```txt
loop 4 {
  C3 1/8
  E3 1/8
  G3 1/8
  rest 1/8
}
```

El compilador expande el contenido del loop. Se permiten loops anidados, hasta
un máximo de 64 repeticiones por loop.

## 5. Clips

```txt
clip riff {
  notes C4 E4 G4 A4
  pattern x-x-[xx]
  subdiv 8n
}

play riff
```

Un clip separa la fuente de notas, el ritmo y la subdivisión. `play` marca el
clip como activo.

## 6. Secciones nombradas

```txt
pattern intro {
  C4 1/4
  D4 1/4
  E4 1/2
}

play intro
```

`pattern nombre {}` es una sección de alto nivel de MuseScript. No debe
confundirse con la propiedad `pattern` de un clip.

## 7. Escalas

```txt
clip melody {
  notes scale D4 minor
  pattern x-x-xx-x
  subdiv 8n
}

play melody
```

Scribbletune genera las notas de la escala y MuseScript las usa como fuente del
clip.

## 8. Progresiones

```txt
clip harmony {
  notes progression C4 major I V vi IV
  pattern x---x---x---x---
  subdiv 4n
}

play harmony
```

Los grados romanos generan acordes completos dentro de una tonalidad.

## 9. Arpegios

```txt
clip arp_line {
  notes arp CM Am FM GM
  pattern xxxxxxxxxxxxxxxx
  subdiv 16n
}

play arp_line
```

El arpegio convierte cada acorde en una sucesión rápida de notas.

## 10. Canales

```txt
tempo 124

channel bass {
  instrument FMSynth
  clip pulse {
    notes C2 G2 A2 F2
    pattern x---x---x---x---
    subdiv 8n
  }
  play pulse
}

channel harmony {
  instrument PolySynth
  clip chords {
    notes progression C4 major I V vi IV
    pattern x---x---x---x---
    subdiv 4n
  }
  play chords
}
```

Cada canal tiene instrumento y clips propios. Todos los clips activos se
reproducen sincronizados por el transporte global.

## 11. Composición experta

Para una canción completa:

1. Usa un canal `MembraneSynth` para el pulso.
2. Añade un bajo con `FMSynth`.
3. Construye armonía con una progresión.
4. Añade un arpegio a `16n`.
5. Crea leads desde una escala.
6. Usa `R` con moderación para variación aleatoria.

Estudia los ejemplos originales `20 · Champion's Pulse` a
`24 · Acid Dreamstate` y termina con `25 · Final`, una homologación de una
sesión Scribbletune de 10 escenas, 17 canales y 73 clips no vacíos.
