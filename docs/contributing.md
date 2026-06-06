# Guía de contribución

## Preparar el entorno

```bash
pnpm install
pnpm test
pnpm dev
```

## Antes de implementar

1. Identifica si el cambio pertenece a UI, DSL, compilador o motor musical.
2. Revisa los tests existentes del módulo.
3. Mantén el DSL independiente de React, Tone.js y Scribbletune.
4. Evita cambiar comportamiento no relacionado.

## Cambiar el DSL

Todo cambio de sintaxis debe incluir:

- Tipos de AST actualizados.
- Parser tolerante a errores.
- Validación semántica.
- Compilación a `CompiledSong`.
- Diagnósticos con código estable.
- Tests válidos e inválidos.
- Actualización de `dsl-reference.md` y `grammar.md`.

## Añadir instrumentos

1. Añade el nombre en `src/dsl/notes.ts`.
2. Implementa el wrapper en `src/music/instruments.ts`.
3. Documenta sus usos recomendados.
4. Añade tests de validación.

## Añadir ejemplos

Los ejemplos viven en `src/examples/examples.ts` y deben:

- Tener nombre numerado según dificultad.
- Incluir una descripción útil.
- Enseñar o demostrar una capacidad concreta.
- Compilar sin diagnósticos.

`src/tests/examples.test.ts` valida automáticamente todos los ejemplos.

## Verificación obligatoria

```bash
pnpm test
pnpm build
```

Para cambios de UI o reproducción, valida también en un navegador:

- Carga inicial.
- Cambio entre ejemplos.
- Activación de audio.
- Play, stop y restart.
- Ausencia de errores en consola.

## Estilo

- TypeScript estricto.
- Componentes React sin acceso directo a Scribbletune.
- Código del DSL sin dependencias de UI o audio.
- Comentarios solo cuando expliquen decisiones no evidentes.
- Documentación y mensajes para usuario en español.

