"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Heart, Share2, Sparkles, Flame, Leaf, 
  ChevronRight, Compass, CheckCircle2, ShieldAlert, Wine, Play, Info
} from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import KayuLogo from "@/components/KayuLogo";

// Simple custom component to dynamically import `@google/model-viewer` without SSR issues
const ARViewer: React.FC<{ modelUrl: string; usdzUrl?: string }> = ({ modelUrl, usdzUrl }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Dynamic import to prevent SSR reference errors on 'customElements'
    import("@google/model-viewer").then(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#171717]/20 border border-white/5 rounded-2xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E38A67]"></div>
        <p className="text-xs text-[#9D9D9D] mt-3 uppercase tracking-widest font-mono">Chargement du modèle 3D...</p>
      </div>
    );
  }

  // Cast element for typescript compatibility
  const ModelViewerElement = "model-viewer" as React.ElementType;

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden glass-card border border-white/5">
      <ModelViewerElement
        src={modelUrl}
        ios-src={usdzUrl || ""}
        alt="KAYU Sushi 3D Food Model"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        shadow-intensity="1.5"
        shadow-softness="1"
        exposure="1"
        environment-image="neutral"
        style={{ width: "100%", height: "100%", background: "transparent" }}
        className="w-full h-full"
      >
        <button
          slot="ar-button"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#E38A67] hover:bg-[#EC9D7C] text-white text-xs font-semibold uppercase tracking-widest py-3.5 px-8 rounded-full shadow-[0_0_20px_rgba(227,138,103,0.35)] transition-all flex items-center space-x-2 z-20"
        >
          <Compass className="h-4 w-4" />
          <span>Placer dans votre espace (AR)</span>
        </button>
      </ModelViewerElement>
    </div>
  );
};

export default function DishDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { dishes, favorites, toggleFavorite, incrementViews, incrementArInteractions } = useMenu();

  const id = params.id as string;
  const initialArTrigger = searchParams.get("ar") === "true";

  const [copied, setCopied] = useState(false);
  const [showArOverlay, setShowArOverlay] = useState(false);

  // Find dish
  const dish = useMemo(() => dishes.find(d => d.id === id), [dishes, id]);
  const isFavorite = useMemo(() => favorites.includes(id), [favorites, id]);

  // Log view
  useEffect(() => {
    if (dish) {
      incrementViews(dish.id);
    }
  }, [dish]);

  // Handle AR query parameter trigger
  useEffect(() => {
    if (initialArTrigger && dish) {
      setShowArOverlay(true);
    }
  }, [initialArTrigger, dish]);

  // Related dishes (same category)
  const relatedDishes = useMemo(() => {
    if (!dish) return [];
    return dishes
      .filter(d => d.category === dish.category && d.id !== dish.id && d.isAvailable)
      .slice(0, 3);
  }, [dishes, dish]);

  if (!dish) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-center p-4">
        <KayuLogo className="h-16 mb-6" />
        <h1 className="text-xl font-light tracking-wide mb-4">Plat introuvable</h1>
        <button onClick={() => router.push("/menu")} className="text-xs uppercase tracking-widest text-[#E38A67] hover:underline">
          Retour au menu
        </button>
      </div>
    );
  }

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `KAYU Sushi - ${dish.name}`,
        text: dish.description,
        url: shareUrl,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  // Setup sample PBR model URLs if missing
  const modelUrl = dish.modelUrl || "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
  const usdzUrl = dish.usdzUrl || "";

  // Food placeholders
  const getPlaceholderImage = (category: string) => {
    switch (category) {
      case "entrees":
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";
      case "chirachi":
        return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop";
      case "poke-bowl":
        return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";
      case "nigiri":
        return "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=600&auto=format&fit=crop";
      case "sashimi-tataki":
        return "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=600&auto=format&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=600&auto=format&fit=crop";
    }
  };

  const mainImage = dish.image || getPlaceholderImage(dish.category);
  
  // Secondary gallery images
  const gallery = [
    mainImage,
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=600&auto=format&fit=crop",
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between">
      
      {/* Top navbar controls */}
      <header className="fixed top-0 left-0 w-full z-40 bg-[#050505]/60 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.push("/menu")} className="flex items-center space-x-2 text-xs tracking-widest text-[#9D9D9D] hover:text-white transition-colors uppercase font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Menu</span>
        </button>
        <span className="text-[12px] tracking-[4px] uppercase text-white font-light font-luxury">{dish.code}</span>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="p-2 rounded-full border border-white/5 hover:border-white/20 text-[#CFCFCF] hover:text-white transition-all relative"
            aria-label="Share dish"
          >
            <Share2 className="h-4 w-4" />
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 top-10 bg-[#E38A67] text-white text-[9px] uppercase tracking-wider py-1 px-2.5 rounded-md whitespace-nowrap z-50 font-medium"
                >
                  Lien copié !
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => toggleFavorite(dish.id)}
            className="p-2 rounded-full border border-white/5 hover:border-white/20 text-[#CFCFCF] hover:text-[#E38A67] transition-all"
            aria-label="Favorite dish"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-[#E38A67] text-[#E38A67]" : ""}`} />
          </button>
        </div>
      </header>

      {/* Main Details Body */}
      <main className="max-w-6xl mx-auto w-full px-4 md:px-8 pt-24 pb-16 z-10 flex-grow grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* Left Column: Image / Gallery & AR trigger */}
        <section className="space-y-6">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#111111] border border-white/5 shadow-2xl">
            <img src={mainImage} alt={dish.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 to-transparent" />
            
            {/* Direct AR Link Button floating on image */}
            <button
              onClick={() => {
                incrementArInteractions(dish.id);
                setShowArOverlay(true);
              }}
              className="absolute bottom-6 right-6 flex items-center space-x-2 bg-[#E38A67] hover:bg-[#EC9D7C] text-white text-xs font-semibold tracking-widest uppercase py-3.5 px-6 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Compass className="h-4 w-4" />
              <span>Voir en 3D / AR</span>
            </button>
          </div>

          {/* Secondary mini image gallery */}
          <div className="grid grid-cols-3 gap-4">
            {gallery.map((img, idx) => (
              <div 
                key={idx} 
                className="aspect-square rounded-xl overflow-hidden border border-white/5 bg-[#111111] cursor-pointer hover:border-white/20 transition-all"
              >
                <img src={img} alt={`Gallery index ${idx}`} className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Descriptions & Details metadata */}
        <section className="flex flex-col justify-between space-y-8">
          <div>
            {/* Title & Badges */}
            <div className="flex items-start justify-between border-b border-white/5 pb-4 mb-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#E38A67] font-mono">{dish.code}</span>
                <h1 className="text-3xl md:text-4xl font-luxury tracking-wider text-white font-light">
                  {dish.name}
                </h1>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {dish.isChefRecommendation && (
                    <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>RECOMMANDÉ PAR LE CHEF</span>
                    </span>
                  )}
                  {dish.isPopular && (
                    <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider bg-[#E38A67]/20 text-[#EC9D7C] border border-[#E38A67]/30">
                      <span>POPULAIRE</span>
                    </span>
                  )}
                  {dish.isSpicy && (
                    <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                      <Flame className="h-2.5 w-2.5" />
                      <span>ÉPICÉ</span>
                    </span>
                  )}
                  {dish.isVegetarian && (
                    <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                      <Leaf className="h-2.5 w-2.5" />
                      <span>VEGAN</span>
                    </span>
                  )}
                </div>
              </div>
              <span className="text-3xl font-light text-[#E38A67] flex items-baseline">
                {dish.price}<span className="text-sm font-medium ml-0.5 uppercase tracking-wider">dt</span>
              </span>
            </div>

            {/* Description */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xs uppercase tracking-widest text-[#9D9D9D]">Description</h3>
              <p className="text-[#CFCFCF] text-sm md:text-base leading-relaxed font-light">
                {dish.description}
              </p>
            </div>

            {/* Ingredients block (IN & OUT if Fresh roll) */}
            {(dish.inIngredients || dish.outIngredients || dish.ingredients) && (
              <div className="glass-card rounded-xl p-5 border border-white/5 space-y-4 mb-6">
                <h3 className="text-xs uppercase tracking-widest text-[#E38A67] flex items-center space-x-1">
                  <Info className="h-3.5 w-3.5" />
                  <span>Composition du Plat</span>
                </h3>
                
                {dish.inIngredients && (
                  <div className="text-xs text-[#9D9D9D]">
                    <span className="text-white font-medium block uppercase tracking-wider mb-1">Cœur (IN)</span>
                    <p className="text-[#CFCFCF] leading-relaxed">{dish.inIngredients}</p>
                  </div>
                )}
                
                {dish.outIngredients && (
                  <div className="text-xs text-[#9D9D9D]">
                    <span className="text-white font-medium block uppercase tracking-wider mb-1">Enveloppe (OUT)</span>
                    <p className="text-[#CFCFCF] leading-relaxed">{dish.outIngredients}</p>
                  </div>
                )}
                
                {dish.ingredients && (
                  <div className="text-xs text-[#CFCFCF] leading-relaxed">
                    {dish.ingredients}
                  </div>
                )}
              </div>
            )}

            {/* Allergens metadata list */}
            <div className="space-y-3 mb-6">
              <h3 className="text-xs uppercase tracking-widest text-[#9D9D9D] flex items-center space-x-1">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Allergènes</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {dish.isSansFarine ? (
                  <span className="px-3 py-1 rounded-lg text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 font-light">Sans Farine (Gluten-Free)</span>
                ) : (
                  <span className="px-3 py-1 rounded-lg text-xs bg-white/5 text-[#9D9D9D] border border-white/5 font-light">Gluten</span>
                )}
                <span className="px-3 py-1 rounded-lg text-xs bg-white/5 text-[#9D9D9D] border border-white/5 font-light">Moutarde / Sésame</span>
                {dish.category !== "extras" && dish.category !== "boissons" && dish.category !== "desserts" && (
                  <span className="px-3 py-1 rounded-lg text-xs bg-white/5 text-[#9D9D9D] border border-white/5 font-light">Poissons / Crustacés</span>
                )}
              </div>
            </div>

            {/* Suggested beverage pairing */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-[#9D9D9D] flex items-center space-x-1">
                <Wine className="h-3.5 w-3.5" />
                <span>Suggestion d&apos;Accords</span>
              </h3>
              <p className="text-xs text-[#CFCFCF] font-light italic leading-relaxed">
                {dish.category === "desserts" 
                  ? "S&apos;accorde idéalement avec notre Thé au Jasmin infusé chaud."
                  : "Se marie parfaitement avec notre Thé Glacé maison ou un cocktail rafraîchissant Virgin Mojito."}
              </p>
            </div>
          </div>

          {/* Action Footer link */}
          <div className="pt-6 border-t border-white/5 mt-auto">
            <button
              onClick={() => {
                incrementArInteractions(dish.id);
                setShowArOverlay(true);
              }}
              className="w-full flex items-center justify-center space-x-3 py-4 rounded-xl bg-gradient-to-r from-[#E38A67] to-[#C86F54] text-white tracking-[3px] uppercase text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
            >
              <Compass className="h-4.5 w-4.5" />
              <span>Lancer l&apos;Expérience Réalité Augmentée</span>
            </button>
          </div>
        </section>
      </main>

      {/* AR Fullscreen Overlay */}
      <AnimatePresence>
        {showArOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-between"
          >
            {/* AR Header */}
            <header className="z-10 w-full flex items-center justify-between px-6 py-4 bg-gradient-to-b from-[#050505] to-transparent">
              <button
                onClick={() => setShowArOverlay(false)}
                className="flex items-center space-x-2 text-xs tracking-widest text-[#9D9D9D] hover:text-white uppercase font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour</span>
              </button>
              <span className="text-[12px] tracking-[4px] uppercase text-white font-light font-luxury">{dish.name}</span>
              <div className="w-8" /> {/* spacer */}
            </header>

            {/* AR Canvas */}
            <div className="flex-grow w-full px-4 md:px-12 pb-12 pt-4">
              <ARViewer modelUrl={modelUrl} usdzUrl={usdzUrl} />
            </div>

            {/* AR Watermark */}
            <footer className="w-full py-4 text-center text-[#9D9D9D] bg-gradient-to-t from-[#050505] to-transparent">
              <p className="text-[9px] tracking-[4px] uppercase text-[#E38A67]">
                PROPULSÉ PAR EASYMENU
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Dishes section */}
      {relatedDishes.length > 0 && (
        <section className="border-t border-white/5 bg-[#111111]/30 py-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-6">
            <h3 className="text-sm uppercase tracking-widest text-[#9D9D9D]">Suggestions similaires</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedDishes.map(rd => (
                <div key={rd.id} className="scale-95 hover:scale-100 transition-transform">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#111111] border border-white/5 mb-3">
                    <Link href={`/dish/${rd.id}`}>
                      <img src={rd.image || getPlaceholderImage(rd.category)} alt={rd.name} className="w-full h-full object-cover" />
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href={`/dish/${rd.id}`} className="text-sm font-luxury text-white hover:text-[#E38A67] transition-colors">{rd.name}</Link>
                    <span className="text-xs text-[#E38A67]">{rd.price} dt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="w-full flex flex-col items-center py-8 text-center text-[#9D9D9D] border-t border-white/5">
        <p className="text-[10px] tracking-[4px] uppercase text-[#E38A67]">
          PROPULSÉ PAR EASYMENU
        </p>
      </footer>
    </div>
  );
}
