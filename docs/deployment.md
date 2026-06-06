# Build y despliegue

MuseScript es una aplicación frontend estática. No necesita backend, base de
datos ni variables de entorno para funcionar.

## Crear el build

```bash
pnpm install
pnpm test
pnpm build
```

El resultado se genera en `dist/`.

## Probar el build localmente

```bash
pnpm preview
```

## Desplegar

Publica el contenido de `dist/` en cualquier hosting estático:

- GitHub Pages.
- Cloudflare Pages.
- Netlify.
- Vercel.
- Servidor Nginx o Apache.

Configuración típica:

| Opción | Valor |
| --- | --- |
| Install command | `pnpm install` |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Node version | `20` o superior |

## Consideraciones

- El audio requiere interacción del usuario incluso en producción.
- La composición actual se guarda en `localStorage` del mismo dominio.
- El sitio debe servirse por HTTPS fuera de localhost para máxima compatibilidad
  con APIs del navegador.
- No se necesita configuración de rutas SPA porque la aplicación utiliza una
  única entrada.

## Verificación posterior

Después de desplegar:

1. Abre la aplicación en una ventana privada.
2. Selecciona un ejemplo básico.
3. Activa audio y pulsa Play.
4. Abre un ejemplo con progresiones.
5. Confirma que no haya errores en consola.
6. Recarga y comprueba la persistencia local.

