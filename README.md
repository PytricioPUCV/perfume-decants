# Decants del Puerto

Tienda de decants (3, 5 y 10 ml). React + TypeScript + Vite + Tailwind CSS v4. Funciona 100% en el navegador: el carrito se guarda en localStorage y el pedido se envía por WhatsApp.

## Uso

```bash
npm install
npm run dev      # desarrollo en http://localhost:5173
npm run build    # build de producción en dist/
```

## Dónde cambiar cosas

- **Perfumes, precios y promos:** `src/data/catalog.ts`
- **Fotos:** coloca los archivos en `public/perfumes/` con el nombre indicado en el campo `image` de cada perfume (por ejemplo `le-male-elixir.jpg`). Si falta una foto, se muestra un frasco de reemplazo.
- **Oferta Cyber (descuentos, marcas árabes):** `src/data/offers.ts`. Para terminarla, cambia `active` a `false`.
- **Número de WhatsApp y formato del mensaje:** `src/utils/whatsappFormatter.ts`
- **Instagram:** `INSTAGRAM_URL` en `src/components/BrandIcons.tsx`
- **Colores y tipografías:** `src/styles/globals.css` (bloque `@theme`)
