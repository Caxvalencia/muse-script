# Arquitectura y contribución

## Pipeline

```txt
Source
  -> tokenize(source)
  -> parseDSL(source)
  -> ProgramNode + Diagnostic[]
  -> compile(ast)
  -> CompiledSong
  -> ScribbletuneMusicEngine
  -> ToneFallbackEngine
  -> Web Audio
```

## Estructura

```txt
src/
  app/          UI principal y estilos
  components/   Editor, controles, diagnósticos, ayuda y previews
  dsl/          AST, tokenizer, parser, compiler y validadores
  examples/     Ruta de ejemplos integrada
  hooks/        Compilación, debounce, playback y localStorage
  music/        Tipos, instrumentos, MIDI, ports y adapters
  playback/     Controlador de reproducción
  tests/        Tests unitarios y de ejemplos
```

## Separación de responsabilidades

### DSL

`src/dsl/` no importa React, Tone.js ni Scribbletune. Produce una
representación independiente del motor.

### Compilador

`compile()` resuelve loops, patterns, canales, instrumentos y clips. Las
expresiones teóricas se conservan temporalmente como referencias internas:

```txt
@scale:C4 major
@progression:C4 major|I V vi IV
@arp:CM FM GM CM||
@chord:C4 M
```

### Motor musical

`MusicEngine` define el contrato:

```ts
interface MusicEngine {
  init(): Promise<void>;
  load(song: CompiledSong): Promise<void>;
  play(): Promise<void>;
  stop(): void;
  restart(): Promise<void>;
  setTempo(bpm: number): void;
  dispose(): void;
}
```

`ScribbletuneMusicEngine` resuelve teoría musical. `ToneFallbackEngine` crea los
instrumentos y programa eventos en el transporte.

## Añadir sintaxis

1. Añade tipos de AST en `src/dsl/ast.ts`.
2. Añade tokens si son necesarios.
3. Implementa parsing tolerante a errores.
4. Añade validación y compilación.
5. Actualiza la referencia y gramática.
6. Añade tests unitarios y un ejemplo válido.

## Añadir un ejemplo

Edita `src/examples/examples.ts`. Los tests compilan automáticamente todos los
ejemplos y fallan si alguno produce diagnósticos:

```bash
pnpm test
```

## Checklist de contribución

```bash
pnpm test
pnpm build
```

Mantén la lógica del DSL independiente de la UI y evita importar motores
musicales desde componentes React.

