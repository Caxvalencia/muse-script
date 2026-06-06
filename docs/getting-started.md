# Inicio rápido

## Instalar el proyecto

```bash
pnpm install
pnpm dev
```

Vite mostrará una URL local. Ábrela en un navegador moderno.

## Activar el audio

Los navegadores bloquean Web Audio hasta que el usuario interactúa con la
página. Pulsa **Activar audio** una vez. Antes de hacerlo, MuseScript puede
parsear y compilar, pero los botones de reproducción permanecen deshabilitados.

## Escribir la primera composición

```txt
tempo 100
instrument Synth

C4 1/4
D4 1/4
E4 1/4
G4 1/2
```

- `tempo 100` configura 100 BPM.
- `instrument Synth` selecciona el instrumento.
- `C4 1/4` toca Do de la cuarta octava durante una negra.

La compilación sucede 500 ms después de cada cambio. Si **Auto-play** está
activo y no hay errores, la versión anterior se detiene y comienza la nueva.

## Usar los ejemplos

El selector contiene una ruta ordenada:

- `01–05`: fundamentos.
- `06–09`: clips y teoría musical.
- `10–12`: composición avanzada.
- `13–19`: melodías conocidas de dominio público.
- `20–24`: canciones originales completas.

Seleccionar un ejemplo reemplaza el editor. **Reset** restaura el ejemplo
seleccionado y **Copiar** copia su código.

## Ver errores

Abre la pestaña **Issues**. Un diagnóstico incluye:

```txt
INVALID_NOTE · L8:3
La nota "H4" no es válida.
```

Corrige todos los errores antes de reproducir. Los warnings informan sobre casos
válidos pero incompletos.

## Siguiente paso

Continúa con el [tutorial de cero a experto](tutorial.md) o consulta directamente
la [referencia del DSL](dsl-reference.md).
