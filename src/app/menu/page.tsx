"use client";
import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Flame, Leaf, Sparkles, SlidersHorizontal, ArrowLeft, RefreshCw, Layers } from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import DishCard from "@/components/DishCard";
import KayuLogo from "@/components/KayuLogo";

export default function MenuCatalog() {
  const { dishes, categories, offers, favorites } = useMenu();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [logoClicks, setLogoClicks] = useState(0);
  const router = useRouter();

  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const nextClicks = prev + 1;
      if (nextClicks >= 5) {
        router.push("/admin");
        return 0;
      }
      return nextClicks;
    });
  };

  // Reset logo clicks after 2 seconds of inactivity
  useEffect(() => {
    if (logoClicks === 0) return;
    const timer = setTimeout(() => {
      setLogoClicks(0);
    }, 2000);
    return () => clearTimeout(timer);
  }, [logoClicks]);

  // Auto-scroll promotional banners
  useEffect(() => {
    if (offers.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [offers]);

  // Filter handlers
  const toggleFilter = (filterKey: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterKey)
        ? prev.filter((k) => k !== filterKey)
        : [...prev, filterKey]
    );
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
    setActiveCategory("all");
  };

  // Filter logic
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // 1. Availability filter (only active available dishes show on menu unless admin preview)
      if (!dish.isAvailable) return false;

      // 2. Category filter
      if (activeCategory !== "all" && dish.category !== activeCategory) return false;

      // 3. Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesCode = dish.code.toLowerCase().includes(query);
        const matchesIngr = dish.ingredients?.toLowerCase().includes(query) || false;
        if (!matchesName && !matchesDesc && !matchesCode && !matchesIngr) return false;
      }

      // 4. Tags filters
      if (activeFilters.includes("chef") && !dish.isChefRecommendation) return false;
      if (activeFilters.includes("popular") && !dish.isPopular) return false;
      if (activeFilters.includes("spicy") && !dish.isSpicy) return false;
      if (activeFilters.includes("vegan") && !dish.isVegetarian) return false;
      if (activeFilters.includes("sansFarine") && !dish.isSansFarine) return false;
      if (activeFilters.includes("cuit") && !dish.isPlatCuit) return false;
      if (activeFilters.includes("new") && !dish.isNew) return false;
      if (activeFilters.includes("favorite") && !favorites.includes(dish.id)) return false;

      return true;
    });
  }, [dishes, activeCategory, searchQuery, activeFilters, favorites]);

  // Group dishes by category to display sections beautifully
  const groupedDishes = useMemo(() => {
    const groups: { [key: string]: typeof dishes } = {};
    filteredDishes.forEach((dish) => {
      if (!groups[dish.category]) {
        groups[dish.category] = [];
      }
      groups[dish.category].push(dish);
    });
    return groups;
  }, [filteredDishes]);

  // Active Category list order sorting based on setup order
  const orderedCategories = useMemo(() => {
    return categories
      .filter((cat) => !cat.isHidden)
      .sort((a, b) => a.order - b.order);
  }, [categories]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col justify-between">
      
      {/* Luxury Gradient Headers */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#111111]/70 to-transparent pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-4 pb-16 z-10 flex-grow">
        
        {/* Navigation Bar */}
        <header className="flex items-center justify-between border-b border-white/5 py-4 mb-8">
          <Link href="/" className="flex items-center space-x-2 text-xs tracking-widest text-[#9D9D9D] hover:text-white transition-colors uppercase font-medium">
            <ArrowLeft className="h-4 w-4" />
            <span>Accueil</span>
          </Link>
          <div className="h-10 w-auto scale-90 cursor-default select-none active:scale-95 transition-transform" onClick={handleLogoClick}>
            <KayuLogo light={true} className="h-12" />
          </div>
          <div className="w-16" /> {/* Hidden backdoor spacer */}
        </header>

        {offers.length > 0 && (
          <div className="relative w-full h-[180px] md:h-[240px] rounded-2xl overflow-hidden mb-8 border border-white/5 shadow-2xl bg-[#111111]">
            <AnimatePresence mode="wait">
              {offers.map((offer, idx) => {
                if (idx !== currentOfferIndex) return null;
                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full flex flex-col justify-end p-6 md:p-10 select-none"
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity"
                      style={{ backgroundImage: `url('${offer.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
                    
                    <div className="relative z-10 max-w-lg">
                      <span className="text-[10px] tracking-[4px] uppercase text-[#E38A67] font-semibold mb-2 block">OFFRE DU MOMENT</span>
                      <h2 className="text-xl md:text-3xl font-luxury tracking-wide text-white font-light mb-2 leading-tight">
                        {offer.title}
                      </h2>
                      <p className="text-xs md:text-sm text-[#CFCFCF] font-light line-clamp-1 mb-4">
                        {offer.subtitle}
                      </p>
                      {offer.dishId && (
                        <Link
                          href={`/dish/${offer.dishId}`}
                          className="inline-flex items-center text-[10px] tracking-wider text-white bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-1.5 rounded-full uppercase transition-all"
                        >
                          Découvrir
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Search & Filter section */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input bar */}
            <div className="relative flex-grow max-w-md">
              <span className="absolute inset-y-0 left-4 flex items-center text-[#9D9D9D]">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un plat, un ingrédient..."
                className="w-full bg-[#111111]/70 border border-white/5 focus:border-[#E38A67]/50 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-[#9D9D9D] focus:outline-none transition-all"
              />
            </div>

            {/* Sticky/Scrollable Category Menu row */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs tracking-wider uppercase font-medium border whitespace-nowrap transition-all duration-300 ${
                  activeCategory === "all"
                    ? "bg-[#E38A67] border-[#E38A67] text-white"
                    : "bg-[#111111]/50 border-white/5 text-[#CFCFCF] hover:border-white/15"
                }`}
              >
                Tout
              </button>
              {orderedCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs tracking-wider uppercase font-medium border whitespace-nowrap transition-all duration-300 ${
                    activeCategory === cat.id
                      ? "bg-[#E38A67] border-[#E38A67] text-white"
                      : "bg-[#111111]/50 border-white/5 text-[#CFCFCF] hover:border-white/15"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <span className="text-[10px] uppercase tracking-widest text-[#9D9D9D] mr-2 flex items-center space-x-1">
              <SlidersHorizontal className="h-3 w-3" />
              <span>Filtres:</span>
            </span>

            {[
              { key: "chef", label: "Chef Recommendation", icon: Sparkles, color: "text-amber-400 border-amber-500/25 bg-amber-500/5" },
              { key: "popular", label: "Populaire", icon: Sparkles, color: "text-[#EC9D7C] border-[#E38A67]/25 bg-[#E38A67]/5" },
              { key: "spicy", label: "Épicé", icon: Flame, color: "text-red-400 border-red-500/25 bg-red-500/5" },
              { key: "vegan", label: "Vegan / Végétarien", icon: Leaf, color: "text-green-400 border-green-500/25 bg-green-500/5" },
              { key: "sansFarine", label: "Sans Farine (Gluten-Free)", icon: Layers, color: "text-blue-300 border-blue-500/25 bg-blue-500/5" },
              { key: "cuit", label: "Plat Cuit", icon: Layers, color: "text-purple-300 border-purple-500/25 bg-purple-500/5" },
              { key: "new", label: "Nouveauté", icon: Sparkles, color: "text-cyan-300 border-cyan-500/25 bg-cyan-500/5" },
              { key: "favorite", label: "Favoris", icon: Sparkles, color: "text-pink-400 border-pink-500/25 bg-pink-500/5" },
            ].map((f) => {
              const isActive = activeFilters.includes(f.key);
              return (
                <button
                  key={f.key}
                  onClick={() => toggleFilter(f.key)}
                  className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-full border text-xs tracking-wide transition-all ${
                    isActive 
                      ? "bg-[#E38A67] border-[#E38A67] text-white" 
                      : `bg-[#111111]/40 border-white/5 text-[#9D9D9D] hover:border-white/15`
                  }`}
                >
                  <f.icon className="h-3 w-3" />
                  <span>{f.label}</span>
                </button>
              );
            })}

            {/* Clear All CTA */}
            {(activeFilters.length > 0 || searchQuery || activeCategory !== "all") && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-xs tracking-wide text-[#E38A67] hover:text-[#EC9D7C] px-3.5 py-1.5 transition-colors uppercase font-medium ml-2"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        </section>

        {/* Dynamic Grid list */}
        <section className="mt-8">
          {filteredDishes.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-20 text-center text-[#9D9D9D]">
              <p className="text-lg font-light tracking-wide mb-2">Aucun plat ne correspond à vos critères.</p>
              <button onClick={clearFilters} className="text-xs uppercase tracking-widest text-[#E38A67] hover:underline">
                Réinitialiser la recherche
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {orderedCategories.map((cat) => {
                const categoryDishes = groupedDishes[cat.id] || [];
                if (categoryDishes.length === 0) return null;
                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-6"
                  >
                    {/* Category Title Heading */}
                    <div className="border-b border-white/5 pb-2">
                      <h2 className="text-2xl font-luxury tracking-wider text-[#FFFFFF] font-light">
                        {cat.name}
                      </h2>
                      {cat.description && (
                        <p className="text-xs tracking-wide text-[#9D9D9D] font-light mt-1">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    {/* Dishes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence>
                        {categoryDishes.map((dish) => (
                          <DishCard key={dish.id} dish={dish} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Discreet Footer */}
      <footer className="z-10 w-full flex flex-col items-center py-10 text-center text-[#9D9D9D] border-t border-white/5">
        <p className="text-[10px] tracking-[4px] uppercase text-[#E38A67] hover:opacity-85 transition-opacity">
          PROPULSÉ PAR EASYMENU
        </p>
      </footer>
    </div>
  );
}
