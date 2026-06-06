# Interfaz, reproducción y MIDI

## Flujo de compilación

Después de 500 ms sin escribir:

1. El tokenizer convierte el source en tokens.
2. El parser crea el AST y diagnósticos sintácticos.
3. El compilador valida semántica y crea `CompiledSong`.
4. Si hay errores, se detiene la reproducción.
5. Si no hay errores y Auto-play está activo, se carga y reproduce la canción.

Nunca deben sonar dos versiones compiladas simultáneamente.

## Controles

| Control | Acción |
| --- | --- |
| Activar audio | Inicia el contexto Web Audio |
| Play | Carga y reproduce la canción válida |
| Stop | Detiene el transporte y vuelve al inicio |
| Restart | Recarga y reproduce desde el inicio |
| Tempo slider | Cambia BPM durante la sesión |
| Auto-play | Reproduce cada compilación válida |
| Exportar MIDI | Descarga `musescript.mid` |
| Copiar | Copia el source |
| Reset | Restaura el ejemplo seleccionado |

## Paneles

- **Song**: canales, instrumentos, volumen en dB, clips activos, patterns y
  subdivisiones.
- **Issues**: errores y warnings con ubicación.
- **AST**: árbol generado por el parser.
- **Help**: resumen de comandos.

## Exportación MIDI

La exportación actual incluye eventos explícitos:

- Notas línea a línea.
- Acordes explícitos.
- Silencios.
- Loops expandidos.
- Patterns nombrados con eventos.

Por ahora no incluye la expansión de:

- Clips nativos basados únicamente en `notes` + `pattern`.
- Escalas, progresiones y arpegios teóricos.

Esos casos sí se reproducen en navegador.

## Persistencia

El source actual se guarda en `localStorage` bajo la clave
`musescript-source`. No existe backend ni sincronización entre dispositivos.
