# Resolución de problemas

## No suena nada

1. Pulsa **Activar audio**.
2. Confirma que la pestaña **Issues** no tenga errores.
3. Confirma que exista al menos un clip o secuencia activa.
4. Pulsa **Play** o activa **Auto-play**.
5. Revisa que el navegador y el sistema no estén silenciados.

## Play está deshabilitado

Play requiere:

- Audio activado.
- Compilación sin errores.

## Auto-play no inicia

Auto-play no puede saltarse la política de audio del navegador. Primero pulsa
**Activar audio** manualmente.

## Error `... is not a valid chord`

Usa los formatos soportados por el DSL:

```txt
chord C4 M 1/2
notes arp CM Am FM GM
notes progression C4 major I V vi IV
```

No escribas directamente el formato interno de Scribbletune como `CM_4`.

## Error `INVALID_NOTE`

Revisa pitch y octava. Ejemplos:

```txt
C4    // válido
F#5   // válido
Bb3   // válido
H4    // inválido
C9    // inválido
```

## Error `INVALID_SCRIBBLE_PATTERN`

Un pattern de clip solo puede usar:

```txt
x - _ R [ ]
```

Los corchetes deben estar balanceados.

## Error `UNKNOWN_PATTERN`

Cada `play nombre` debe apuntar a un `clip nombre` o `pattern nombre` en el
mismo canal o ámbito principal.

## El MIDI está vacío o incompleto

La exportación MIDI actual solo incluye secuencias de eventos explícitos. Los
clips teóricos y nativos se reproducen, pero todavía no se exportan.

## Warning de Vite sobre `fs`

Scribbletune importa código que referencia `fs`. Vite lo externaliza para el
navegador. Es un warning conocido y el build sigue siendo funcional.

## Warning de bundle grande

Tone.js, Scribbletune y CodeMirror aumentan el bundle. El warning no impide el
build. Una futura optimización puede separar esos módulos en chunks.

## Limpiar e instalar de nuevo

```bash
rm -rf node_modules dist
pnpm install
pnpm test
pnpm build
```

