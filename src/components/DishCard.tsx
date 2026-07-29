"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, Flame, Eye, Leaf, ShieldAlert } from "lucide-react";
import { Dish } from "@/data/menuData";
import { useMenu } from "@/context/MenuContext";

interface DishCardProps {
  dish: Dish;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { favorites, toggleFavorite, incrementViews } = useMenu();
  const isFavorite = favorites.includes(dish.id);

  // High-quality beautiful food placeholders by category name to wow the user
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
      case "gunkan":
        return "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop";
      case "sashimi-tataki":
        return "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=600&auto=format&fit=crop";
      case "fresh-roll":
      case "california":
      case "fusion-rolls":
        return "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?q=80&w=600&auto=format&fit=crop";
      case "maki":
      case "maki-inverse":
        return "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=600&auto=format&fit=crop";
      case "crunchy":
      case "crunchy-fusion":
        return "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=600&auto=format&fit=crop";
      case "yakitori":
        return "https://images.unsplash.com/photo-1594972101305-6f8aa20d77d7?q=80&w=600&auto=format&fit=crop";
      case "nouilles":
      case "riz-saute":
        return "https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600&auto=format&fit=crop";
      case "desserts":
        return "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=600&auto=format&fit=crop";
      case "boissons":
        return "https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=600&auto=format&fit=crop";
      default:
        return "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=600&auto=format&fit=crop";
    }
  };

  const imageUrl = dish.image || getPlaceholderImage(dish.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 25 }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl glass-card border border-white/5 transition-all duration-300 h-full"
    >
      {/* Glow Effect on Card Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E38A67]/0 via-[#E38A67]/0 to-[#E38A67]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Media Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#111111] select-none">
        
        {/* Card Image */}
        <Link href={`/dish/${dish.id}`} onClick={() => incrementViews(dish.id)}>
          <motion.img
            src={imageUrl}
            alt={dish.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(dish.id)}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#050505]/60 backdrop-blur-md border border-white/10 text-white hover:text-[#E38A67] hover:scale-105 active:scale-95 transition-all"
          aria-label="Add to favorites"
        >
          <Heart className={`h-4.5 w-4.5 ${isFavorite ? "fill-[#E38A67] text-[#E38A67]" : ""}`} />
        </button>

        {/* Badges Container */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 pointer-events-none">
          {dish.isChefRecommendation && (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md uppercase">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Chef</span>
            </span>
          )}
          {dish.isPopular && (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider bg-[#E38A67]/20 text-[#EC9D7C] border border-[#E38A67]/30 backdrop-blur-md uppercase">
              <Sparkles className="h-2.5 w-2.5" />
              <span>Populaire</span>
            </span>
          )}
          {dish.isNew && (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-md uppercase">
              <span>Nouveau</span>
            </span>
          )}
          {dish.isSpicy && (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 backdrop-blur-md uppercase">
              <Flame className="h-2.5 w-2.5" />
              <span>Épicé</span>
            </span>
          )}
          {dish.isVegetarian && (
            <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-medium tracking-wider bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-md uppercase">
              <Leaf className="h-2.5 w-2.5" />
              <span>Vegan</span>
            </span>
          )}
        </div>
      </div>

      {/* Details Area */}
      <div className="flex flex-col flex-grow p-5 justify-between">
        <div>
          {/* Header row: Code, Name, Price */}
          <div className="flex items-start justify-between space-x-2 mb-2">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider text-[#9D9D9D] font-mono">{dish.code}</span>
              <h3 className="text-md font-luxury tracking-wide text-white font-medium group-hover:text-[#E38A67] transition-colors leading-tight">
                {dish.name}
              </h3>
            </div>
            <span className="text-lg font-light text-[#E38A67] flex items-baseline">
              {dish.price}<span className="text-[11px] font-medium ml-0.5 uppercase tracking-wider">dt</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-[12px] text-[#9D9D9D] line-clamp-2 leading-relaxed mb-4">
            {dish.description}
          </p>
        </div>

        {/* Action Row */}
        <div className="flex items-center space-x-2 pt-4 border-t border-white/5 mt-auto">
          {/* View details */}
          <Link
            href={`/dish/${dish.id}`}
            onClick={() => incrementViews(dish.id)}
            className="flex-grow flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl border border-white/5 bg-[#171717]/40 hover:bg-[#171717]/80 hover:border-white/20 text-[#CFCFCF] hover:text-white transition-all text-xs tracking-wider uppercase font-medium"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Détails</span>
          </Link>
          
          {/* View in AR */}
          <Link
            href={`/dish/${dish.id}?ar=true`}
            onClick={() => incrementViews(dish.id)}
            className="flex items-center justify-center space-x-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-[#E38A67]/20 to-[#E38A67]/10 hover:from-[#E38A67]/30 hover:to-[#E38A67]/20 border border-[#E38A67]/30 text-[#EC9D7C] hover:text-[#FFFFFF] transition-all text-xs tracking-wider uppercase font-medium"
          >
            <span>AR</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
export default DishCard;
