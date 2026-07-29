"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_CATEGORIES, INITIAL_DISHES, Dish, Category } from "@/data/menuData";

interface BannerOffer {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  dishId?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

interface MenuContextType {
  dishes: Dish[];
  categories: Category[];
  offers: BannerOffer[];
  favorites: string[];
  isAdmin: boolean;
  totalViews: number;
  totalArInteractions: number;
  
  // Actions
  toggleFavorite: (id: string) => void;
  incrementViews: (id: string) => void;
  incrementArInteractions: (id: string) => void;
  
  // Admin Operations
  setAdminStatus: (status: boolean) => void;
  addDish: (dish: Omit<Dish, "views" | "arInteractions">) => void;
  updateDish: (dish: Dish) => void;
  deleteDish: (id: string) => void;
  
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categories: Category[]) => void;
  
  addOffer: (offer: BannerOffer) => void;
  updateOffer: (offer: BannerOffer) => void;
  deleteOffer: (id: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DISHES: "kayu_dishes_v1",
  CATEGORIES: "kayu_categories_v1",
  OFFERS: "kayu_offers_v1",
  FAVORITES: "kayu_favorites_v1",
  ADMIN: "kayu_admin_v1",
};

const DEFAULT_OFFERS: BannerOffer[] = [
  {
    id: "offer1",
    title: "Symphonie de Daurade & Mangue",
    subtitle: "Une explosion de saveurs exotiques aux éclats de truffes noires",
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1200&auto=format&fit=crop",
    dishId: "c13",
    isActive: true,
  },
  {
    id: "offer2",
    title: "Le Rituel Omakase",
    subtitle: "Découvrez notre plateau de la semaine, une sélection exclusive du chef",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
    dishId: "p6",
    isActive: true,
  }
];

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers] = useState<BannerOffer[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const storedDishes = localStorage.getItem(STORAGE_KEYS.DISHES);
    const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const storedOffers = localStorage.getItem(STORAGE_KEYS.OFFERS);
    const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    const storedAdminStatus = localStorage.getItem(STORAGE_KEYS.ADMIN);

    setDishes(storedDishes ? JSON.parse(storedDishes) : INITIAL_DISHES);
    setCategories(storedCategories ? JSON.parse(storedCategories) : INITIAL_CATEGORIES);
    setOffers(storedOffers ? JSON.parse(storedOffers) : DEFAULT_OFFERS);
    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
    setIsAdmin(storedAdminStatus === "true");
  }, []);

  // Save helpers
  const saveDishes = (newDishes: Dish[]) => {
    setDishes(newDishes);
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(newDishes));
  };

  const saveCategories = (newCats: Category[]) => {
    setCategories(newCats);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(newCats));
  };

  const saveOffers = (newOffers: BannerOffer[]) => {
    setOffers(newOffers);
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(newOffers));
  };

  const saveFavorites = (newFavs: string[]) => {
    setFavorites(newFavs);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(newFavs));
  };

  const toggleFavorite = (id: string) => {
    const updated = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    saveFavorites(updated);
  };

  const incrementViews = (id: string) => {
    const updated = dishes.map(dish => 
      dish.id === id ? { ...dish, views: (dish.views || 0) + 1 } : dish
    );
    saveDishes(updated);
  };

  const incrementArInteractions = (id: string) => {
    const updated = dishes.map(dish => 
      dish.id === id ? { ...dish, arInteractions: (dish.arInteractions || 0) + 1 } : dish
    );
    saveDishes(updated);
  };

  const setAdminStatus = (status: boolean) => {
    setIsAdmin(status);
    localStorage.setItem(STORAGE_KEYS.ADMIN, String(status));
  };

  // Dish Operations
  const addDish = (dish: Omit<Dish, "views" | "arInteractions">) => {
    const newDish: Dish = {
      ...dish,
      views: 0,
      arInteractions: 0,
    };
    saveDishes([newDish, ...dishes]);
  };

  const updateDish = (updatedDish: Dish) => {
    const updated = dishes.map(dish => (dish.id === updatedDish.id ? updatedDish : dish));
    saveDishes(updated);
  };

  const deleteDish = (id: string) => {
    const updated = dishes.filter(dish => dish.id !== id);
    saveDishes(updated);
  };

  // Category Operations
  const addCategory = (cat: Category) => {
    saveCategories([...categories, cat].sort((a, b) => a.order - b.order));
  };

  const updateCategory = (updatedCat: Category) => {
    const updated = categories.map(cat => (cat.id === updatedCat.id ? updatedCat : cat));
    saveCategories(updated.sort((a, b) => a.order - b.order));
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter(cat => cat.id !== id);
    saveCategories(updated);
  };

  const reorderCategories = (orderedCats: Category[]) => {
    const reordered = orderedCats.map((cat, idx) => ({ ...cat, order: idx + 1 }));
    saveCategories(reordered);
  };

  // Offer Operations
  const addOffer = (offer: BannerOffer) => {
    saveOffers([...offers, offer]);
  };

  const updateOffer = (updatedOffer: BannerOffer) => {
    const updated = offers.map(o => (o.id === updatedOffer.id ? updatedOffer : o));
    saveOffers(updated);
  };

  const deleteOffer = (id: string) => {
    const updated = offers.filter(o => o.id !== id);
    saveOffers(updated);
  };

  // Aggregated Stats
  const totalViews = dishes.reduce((sum, d) => sum + (d.views || 0), 0);
  const totalArInteractions = dishes.reduce((sum, d) => sum + (d.arInteractions || 0), 0);

  return (
    <MenuContext.Provider
      value={{
        dishes,
        categories,
        offers,
        favorites,
        isAdmin,
        totalViews,
        totalArInteractions,
        toggleFavorite,
        incrementViews,
        incrementArInteractions,
        setAdminStatus,
        addDish,
        updateDish,
        deleteDish,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addOffer,
        updateOffer,
        deleteOffer,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
};
