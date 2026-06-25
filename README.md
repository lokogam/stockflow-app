# Stockflow App

Frontend de Stockflow para catalogo, administracion de marcas y administracion de productos. Esta app consume el backend Laravel/API existente y usa Sanctum con cookies para autenticacion y CRUD.

## Stack

- Next.js 16 con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Axios para llamadas al backend
- Lucide React para iconos

## Funcionalidades

- Tienda con busqueda por nombre y marca
- Filtro por marca y unidad
- Tarjetas de producto con imagen generica compartida
- Panel de administracion para marcas y productos
- Formularios de crear y editar con validacion en frontend
- Eliminacion con modal de confirmacion
- Integracion con backend Laravel via API REST

## Variables de entorno

Crear un archivo `.env.local` con la URL del backend:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

En produccion, apunta a la URL publica del backend desplegado.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Inicio rapido

1. Instala dependencias:

```bash
npm install
```

2. Crea `.env.local` a partir de `.env.example` y ajusta `NEXT_PUBLIC_BACKEND_URL`.

3. Levanta el frontend:

```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000).

## Backend esperado

El frontend espera un backend Laravel disponible en `/api` con estas rutas principales:

- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `GET /api/brands`
- `POST /api/brands`
- `PUT /api/brands/{id}`
- `DELETE /api/brands/{id}`

Tambien requiere `/sanctum/csrf-cookie` para mutaciones autenticadas con Sanctum.

## Estructura relevante

- `src/app/store/page.tsx` catalogo publico
- `src/app/admin/products/page.tsx` administracion de productos
- `src/app/admin/brands/page.tsx` administracion de marcas
- `src/lib/api.ts` cliente API
- `src/lib/axios.ts` configuracion de Axios y backend URL
- `src/components/forms/` formularios reutilizables
- `src/components/ui/` componentes base de la interfaz

## Notas de despliegue

- Configura `NEXT_PUBLIC_BACKEND_URL` con la URL publica del API.
- Verifica CORS y Sanctum en el backend para permitir el dominio del frontend.
- Ejecuta `npm run build` antes de desplegar.
