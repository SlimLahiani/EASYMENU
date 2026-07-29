import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KAYU Sushi Premium Digital Menu",
    short_name: "KAYU Sushi",
    description: "Visualisez notre menu gastronomique de sushis en Réalité Augmentée.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#E38A67",
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
    ],
  };
}
