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

## Estructura principal

- app/: páginas y vistas de la tienda
- data/: datos y funciones de productos
- lib/: cliente de Supabase

