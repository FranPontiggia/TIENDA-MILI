import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    scope: "/",
    name: "Cuota Market",
    short_name: "Cuota Market",
    description: "Electrodomésticos confiables para tu hogar. Pedidos y consultas por WhatsApp.",
    start_url: "/",
    display: "standalone",
    background_color: "#120d09",
    theme_color: "#120d09",
    lang: "es-AR",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
