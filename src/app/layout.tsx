import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";
import { MenuProvider } from "@/context/MenuContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-luxury",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KAYU Sushi | Menu Digital Premium & Expérience RA",
  description: "Découvrez la carte immersive et luxueuse de KAYU Sushi, propulsée par EASYMENU. Visualisez l'art culinaire japonais en Réalité Augmentée.",
  metadataBase: new URL("https://kayusushi.com"),
  openGraph: {
    title: "KAYU Sushi | Menu Digital Premium",
    description: "Découvrez la carte immersive et luxueuse de KAYU Sushi avec visualisation en Réalité Augmentée.",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KAYU Sushi | Menu Digital Premium",
    description: "Découvrez la carte immersive et luxueuse de KAYU Sushi avec visualisation en Réalité Augmentée.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${cormorant.variable} ${outfit.variable} h-full antialiased`}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="min-h-full bg-[#050505] text-[#FFFFFF] font-sans selection:bg-[#E38A67]/30 selection:text-[#E38A67] overflow-x-hidden">
        <MenuProvider>
          {children}
        </MenuProvider>
      </body>
    </html>
  );
}
