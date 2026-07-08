# Tienda Web

Este proyecto está hecho con Next.js y TypeScript y usa Supabase como fuente de datos para los productos.

No necesita XAMPP ni una base MySQL local.

## Requisitos

- Node.js 20+
- Variables de entorno de Supabase

## Variables de entorno

Crea un archivo .env.local con:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_URL.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
NEXT_PUBLIC_SUPABASE_PRODUCTS_TABLE=productos
```

## Inicio local

```bash
npm install
npm run dev
```

Abre http://localhost:3000 para ver la tienda.

## Corregir rutas de imagen en Supabase

Si algun producto tiene rutas mal cargadas (comillas, espacios extra o sin extension), podes usar:

```bash
npm run fix:images:dry
```

Ese comando solo muestra cambios (no actualiza).

Para aplicar la correccion en Supabase:

```bash
npm run fix:images
```

Para corregir solo productos que coincidan por nombre:

```bash
node scripts/fix-product-images.mjs --only=cubiertos
```

## Importar y sincronizar productos con Supabase

Validar datos sin escribir en la base:

```bash
npm run import:products:dry
```

Importar productos:

```bash
npm run import:products
```

Sincronizacion completa (importa y luego corrige rutas de imagen):

```bash
npm run sync:supabase
```

Simulacion de sincronizacion completa:

```bash
npm run sync:supabase:dry
```

## Exportar productos desde Supabase al repo

Si queres que GitHub tenga una copia de los productos actuales de Supabase, usa:

```bash
npm run sync:repo
```

Para probar sin escribir el archivo:

```bash
npm run export:products:dry
```

Este flujo actualiza `products-import.json` con los productos remotos, para mantener sincronizado el fallback local.

## Procesar capturas de celular

Si guardas capturas en `capturas/`, podes recortarlas y convertirlas a WebP automaticamente:

```bash
npm run capturas:process
```

Para simular sin escribir archivos:

```bash
npm run capturas:process:dry
```

Configura el recorte en `scripts/process-capturas.mjs` con estas variables:

- `CROP_TOP`
- `CROP_BOTTOM`
- `CROP_LEFT`
- `CROP_RIGHT`

Para usar nombres personalizados, crea `capturas/nombres-map.json` con pares `archivo-original -> nombre-salida`.

Ejemplo:

```json
{
	"WhatsApp Image 2026-07-08 at 12.46.35.webp": "equipo-matero-1",
	"WhatsApp Image 2026-07-08 at 12.46.35 (1).jpg": "equipo-matero-2",
	"foto-123": "mate-accesorios"
}
```

Si no existe este archivo, el script usa nombres automaticos limpios.

## Estructura principal

- app/: páginas y vistas de la tienda
- data/: datos y funciones de productos
- lib/: cliente de Supabase

