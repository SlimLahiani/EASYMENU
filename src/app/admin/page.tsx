"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Plus, Edit2, Trash2, Copy, ToggleLeft, ToggleRight, 
  BarChart3, Settings, ShieldCheck, Tag, Layers, Percent, Eye, Compass, 
  Sparkles, Flame, Leaf, HelpCircle, Save, QrCode, FileText
} from "lucide-react";
import { useMenu } from "@/context/MenuContext";
import { Dish, Category } from "@/data/menuData";
import KayuLogo from "@/components/KayuLogo";

// Simple QR generator simulation using API or canvas
const getQrCodeUrl = (url: string) => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&color=050505&bgcolor=ffffff`;
};

export default function AdminDashboard() {
  const router = useRouter();
  const { 
    dishes, categories, offers, isAdmin, totalViews, totalArInteractions, setAdminStatus,
    addDish, updateDish, deleteDish, 
    addCategory, updateCategory, deleteCategory,
    addOffer, updateOffer, deleteOffer
  } = useMenu();

  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"stats" | "dishes" | "categories" | "offers" | "settings">("stats");

  // Local Form states
  const [editingDish, setEditingDish] = useState<Partial<Dish> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [restaurantSettings, setRestaurantSettings] = useState({
    name: "KAYU Sushi",
    tagline: "Menu Digital Premium & Expérience RA",
    address: "SFAX: Route Teniour, Av. Abdelaziz Thaalbi | TUNIS: Jardins de Carthage, Imm. Montazah, le Kram | Sidi Daoud, la Marsa, rte station shell",
    phone: "+216 25 96 66 67 (Sfax) / +216 25 26 66 67 (Kram) / +216 28 336 667 (Marsa)",
    email: "Hello@kayusushi.com / Sfax@kayusushi.com",
    hours: "Mardi - Dimanche: 12h00 - 23h30",
  });

  // Auth handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin" || password === "kayusushi2026") {
      setAdminStatus(true);
      setAuthError("");
    } else {
      setAuthError("Mot de passe incorrect.");
    }
  };

  const handleLogout = () => {
    setAdminStatus(false);
    setPassword("");
  };

  // File to Base64 Helpers
  const handleDishFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "image" | "modelUrl" | "usdzUrl") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string" && editingDish) {
        setEditingDish({
          ...editingDish,
          [field]: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOfferFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string" && editingOffer) {
        setEditingOffer({
          ...editingOffer,
          image: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Dish Operations
  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;

    const dishToSave = {
      id: editingDish.id || `dish_${Date.now()}`,
      code: editingDish.code || "N/A",
      name: editingDish.name || "Nouveau Plat",
      price: Number(editingDish.price) || 0,
      description: editingDish.description || "",
      category: editingDish.category || categories[0]?.id || "entrees",
      isAvailable: editingDish.isAvailable !== false,
      isPopular: !!editingDish.isPopular,
      isChefRecommendation: !!editingDish.isChefRecommendation,
      isVegetarian: !!editingDish.isVegetarian,
      isSpicy: !!editingDish.isSpicy,
      isSansFarine: !!editingDish.isSansFarine,
      isPlatCuit: !!editingDish.isPlatCuit,
      isNew: !!editingDish.isNew,
      ingredients: editingDish.ingredients || "",
      inIngredients: editingDish.inIngredients || "",
      outIngredients: editingDish.outIngredients || "",
      image: editingDish.image || "",
      modelUrl: editingDish.modelUrl || "",
      usdzUrl: editingDish.usdzUrl || "",
    };

    if (editingDish.id) {
      updateDish(dishToSave as Dish);
    } else {
      addDish(dishToSave);
    }
    setEditingDish(null);
  };

  // Duplicate dish
  const handleDuplicateDish = (dish: Dish) => {
    const duplicated = {
      ...dish,
      id: `dish_${Date.now()}`,
      code: `${dish.code}_copy`,
      name: `${dish.name} (Copie)`,
    };
    addDish(duplicated);
  };

  // Category Operations
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    const catToSave = {
      id: editingCategory.id || `cat_${Date.now()}`,
      name: editingCategory.name || "Nouvelle Catégorie",
      description: editingCategory.description || "",
      order: Number(editingCategory.order) || categories.length + 1,
      isHidden: !!editingCategory.isHidden,
    };

    if (editingCategory.id) {
      updateCategory(catToSave as Category);
    } else {
      addCategory(catToSave);
    }
    setEditingCategory(null);
  };

  // Promo Banner Operations
  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    const offerToSave = {
      id: editingOffer.id || `offer_${Date.now()}`,
      title: editingOffer.title || "Titre de l'offre",
      subtitle: editingOffer.subtitle || "",
      image: editingOffer.image || "",
      dishId: editingOffer.dishId || "",
      isActive: editingOffer.isActive !== false,
    };

    if (editingOffer.id) {
      updateOffer(offerToSave);
    } else {
      addOffer(offerToSave);
    }
    setEditingOffer(null);
  };

  // Most popular dishes by views
  const topDishes = useMemo(() => {
    return [...dishes].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  }, [dishes]);

  // Auth Guard Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card border border-white/5 rounded-2xl p-8 space-y-6"
        >
          <div className="flex flex-col items-center text-center">
            <KayuLogo className="h-16 mb-4" />
            <h1 className="text-xl font-luxury text-white tracking-widest uppercase font-light">Console Administration</h1>
            <p className="text-xs text-[#9D9D9D] mt-2 tracking-wide">Veuillez entrer le mot de passe administrateur</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-[#E38A67] transition-colors"
                required
              />
              {authError && <p className="text-red-400 text-xs mt-2">{authError}</p>}
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => router.push("/menu")}
                className="flex-grow py-3 rounded-xl border border-white/5 text-xs uppercase tracking-widest hover:bg-white/5 transition-colors font-medium"
              >
                Retour
              </button>
              <button
                type="submit"
                className="flex-grow py-3 rounded-xl bg-[#E38A67] hover:bg-[#EC9D7C] text-white text-xs uppercase tracking-widest font-semibold transition-colors shadow-lg"
              >
                Entrer
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between">
      
      {/* Admin Panel Header */}
      <header className="bg-[#111111] border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-6">
          <button onClick={() => router.push("/menu")} className="flex items-center space-x-2 text-xs tracking-widest text-[#9D9D9D] hover:text-white uppercase font-medium">
            <ArrowLeft className="h-4 w-4" />
            <span>Vers la Carte</span>
          </button>
          <span className="h-6 w-px bg-white/10 hidden md:block" />
          <span className="text-xs uppercase tracking-widest text-[#E38A67] font-semibold hidden md:block">ADMIN CONSOLE</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-white">{restaurantSettings.name}</p>
            <p className="text-[10px] text-[#9D9D9D] uppercase tracking-wider">Mode Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs tracking-widest text-red-400 hover:text-red-300 transition-colors uppercase font-medium"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Panel Content Area */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          {[
            { id: "stats", label: "Statistiques & Activités", icon: BarChart3 },
            { id: "dishes", label: "Gestion des Plats", icon: Tag },
            { id: "categories", label: "Gestion des Catégories", icon: Layers },
            { id: "offers", label: "Offres & Bannières", icon: Percent },
            { id: "settings", label: "Configuration & QR", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setEditingDish(null);
                setEditingCategory(null);
                setEditingOffer(null);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium border text-left transition-all ${
                activeTab === tab.id
                  ? "bg-[#E38A67] border-[#E38A67] text-white shadow-lg shadow-[#E38A67]/10"
                  : "bg-[#111111]/40 border-white/5 text-[#9D9D9D] hover:border-white/10 hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Dynamic Workspace Area */}
        <main className="lg:col-span-3">
          
          {/* TAB 1: Stats & Overview Dashboard */}
          {activeTab === "stats" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Views Stat */}
                <div className="glass-card border border-white/5 p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-[#9D9D9D]">
                    <span className="text-xs uppercase tracking-widest">Vues totales menu</span>
                    <Eye className="h-4 w-4 text-[#E38A67]" />
                  </div>
                  <p className="text-3xl font-light text-white font-mono">{totalViews}</p>
                  <p className="text-[10px] text-[#9D9D9D]">Trafic organique cumulé</p>
                </div>

                {/* AR Interactions Stat */}
                <div className="glass-card border border-white/5 p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-[#9D9D9D]">
                    <span className="text-xs uppercase tracking-widest">Interactions AR 3D</span>
                    <Compass className="h-4 w-4 text-[#E38A67]" />
                  </div>
                  <p className="text-3xl font-light text-white font-mono">{totalArInteractions}</p>
                  <p className="text-[10px] text-[#9D9D9D]">Visualisations de plats réels</p>
                </div>

                {/* Total Dishes Stat */}
                <div className="glass-card border border-white/5 p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-[#9D9D9D]">
                    <span className="text-xs uppercase tracking-widest">Plats Référencés</span>
                    <Tag className="h-4 w-4 text-[#E38A67]" />
                  </div>
                  <p className="text-3xl font-light text-white font-mono">{dishes.length}</p>
                  <p className="text-[10px] text-[#9D9D9D]">{categories.length} catégories actives</p>
                </div>

              </div>

              {/* Popular list */}
              <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm uppercase tracking-widest text-[#E38A67]">Les Plats les Plus Consultés</h3>
                <div className="divide-y divide-white/5">
                  {topDishes.map((dish, index) => (
                    <div key={dish.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono text-[#9D9D9D]">#{index + 1}</span>
                        <p className="text-sm font-medium">{dish.name}</p>
                        <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-[#9D9D9D] uppercase tracking-wider">{dish.code}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-xs font-mono text-[#9D9D9D]">{dish.views || 0} vues</span>
                        <span className="text-xs text-[#E38A67]">{dish.price} dt</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Dishes Management List */}
          {activeTab === "dishes" && !editingDish && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg uppercase tracking-wider text-white">Tous les plats de la carte</h2>
                <button
                  onClick={() => setEditingDish({})}
                  className="flex items-center space-x-2 bg-[#E38A67] hover:bg-[#EC9D7C] text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter un plat</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dishes.map((dish) => (
                  <div key={dish.id} className="glass-card border border-white/5 rounded-2xl p-5 flex items-center justify-between space-x-4">
                    <div className="flex-grow space-y-1.5 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-mono text-[#9D9D9D] uppercase tracking-wider">{dish.code}</span>
                        <h4 className="text-sm font-semibold truncate">{dish.name}</h4>
                      </div>
                      <p className="text-xs text-[#CFCFCF] font-mono">{dish.price} dt • <span className="capitalize">{dish.category}</span></p>
                      
                      {/* Tags visualization indicator */}
                      <div className="flex flex-wrap gap-1">
                        {dish.isChefRecommendation && <span className="text-[8px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">Chef</span>}
                        {dish.isPopular && <span className="text-[8px] bg-[#E38A67]/10 text-[#EC9D7C] px-1.5 py-0.5 rounded">Populaire</span>}
                        {dish.isSpicy && <span className="text-[8px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">Épicé</span>}
                        {dish.isVegetarian && <span className="text-[8px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">Vegan</span>}
                        {dish.isSansFarine && <span className="text-[8px] bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded">Gluten Free</span>}
                        {dish.isAvailable ? (
                          <span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Disponible</span>
                        ) : (
                          <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Masqué</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => setEditingDish(dish)}
                        className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:text-[#E38A67] transition-all"
                        aria-label="Edit dish"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicateDish(dish)}
                        className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:text-white transition-all"
                        aria-label="Duplicate dish"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDish(dish.id)}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 transition-all"
                        aria-label="Delete dish"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dishes Add/Edit Form view */}
          {activeTab === "dishes" && editingDish && (
            <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-md uppercase tracking-wider text-[#E38A67]">
                  {editingDish.id ? "Modifier le Plat" : "Créer un Nouveau Plat"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="text-xs tracking-widest text-[#9D9D9D] hover:text-white uppercase font-medium"
                >
                  Annuler
                </button>
              </div>

              <form onSubmit={handleSaveDish} className="space-y-4 text-xs md:text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Code Unique (ex: PK1)</label>
                    <input
                      type="text"
                      value={editingDish.code || ""}
                      onChange={(e) => setEditingDish({ ...editingDish, code: e.target.value })}
                      placeholder="SL1"
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Prix (dt)</label>
                    <input
                      type="number"
                      step="any"
                      value={editingDish.price || ""}
                      onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                      placeholder="12"
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Nom du Plat</label>
                  <input
                    type="text"
                    value={editingDish.name || ""}
                    onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                    placeholder="Salade de choux..."
                    className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    value={editingDish.description || ""}
                    onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                    placeholder="Entrée croustillante..."
                    rows={3}
                    className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Catégorie</label>
                    <select
                      value={editingDish.category || ""}
                      onChange={(e) => setEditingDish({ ...editingDish, category: e.target.value })}
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Nombre de pièces (Facultatif)</label>
                    <input
                      type="text"
                      value={editingDish.pieces || ""}
                      onChange={(e) => setEditingDish({ ...editingDish, pieces: e.target.value })}
                      placeholder="8 pcs, 2 pcs..."
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#111111]/40 p-4 rounded-xl border border-white/5">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={editingDish.isAvailable !== false}
                      onChange={(e) => setEditingDish({ ...editingDish, isAvailable: e.target.checked })}
                      className="accent-[#E38A67] h-4 w-4"
                    />
                    <label htmlFor="isAvailable" className="text-xs uppercase tracking-wider text-[#CFCFCF]">Disponible</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPopular"
                      checked={!!editingDish.isPopular}
                      onChange={(e) => setEditingDish({ ...editingDish, isPopular: e.target.checked })}
                      className="accent-[#E38A67] h-4 w-4"
                    />
                    <label htmlFor="isPopular" className="text-xs uppercase tracking-wider text-[#CFCFCF]">Populaire</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isChef"
                      checked={!!editingDish.isChefRecommendation}
                      onChange={(e) => setEditingDish({ ...editingDish, isChefRecommendation: e.target.checked })}
                      className="accent-[#E38A67] h-4 w-4"
                    />
                    <label htmlFor="isChef" className="text-xs uppercase tracking-wider text-[#CFCFCF]">Choix Chef</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isSpicy"
                      checked={!!editingDish.isSpicy}
                      onChange={(e) => setEditingDish({ ...editingDish, isSpicy: e.target.checked })}
                      className="accent-[#E38A67] h-4 w-4"
                    />
                    <label htmlFor="isSpicy" className="text-xs uppercase tracking-wider text-[#CFCFCF]">Épicé</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isVegetarian"
                      checked={!!editingDish.isVegetarian}
                      onChange={(e) => setEditingDish({ ...editingDish, isVegetarian: e.target.checked })}
                      className="accent-[#E38A67] h-4 w-4"
                    />
                    <label htmlFor="isVegetarian" className="text-xs uppercase tracking-wider text-[#CFCFCF]">Vegan</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isGluten"
                      checked={!!editingDish.isSansFarine}
                      onChange={(e) => setEditingDish({ ...editingDish, isSansFarine: e.target.checked })}
                      className="accent-[#E38A67] h-4 w-4"
                    />
                    <label htmlFor="isGluten" className="text-xs uppercase tracking-wider text-[#CFCFCF]">Sans Farine</label>
                  </div>
                </div>                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-[#E38A67] border-b border-white/5 pb-1">Media & 3D (AR)</h4>
                  
                  {/* Image Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Importer Image (PNG/JPG/WEBP)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleDishFileChange(e, "image")}
                        className="w-full bg-[#111111] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-[#CFCFCF] focus:outline-none file:mr-4 file:py-1 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E38A67]/20 file:text-[#EC9D7C] hover:file:bg-[#E38A67]/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">URL Image (Alternative)</label>
                      <input
                        type="url"
                        value={editingDish.image || ""}
                        onChange={(e) => setEditingDish({ ...editingDish, image: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                      />
                    </div>
                  </div>

                  {/* 3D Models Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {/* GLB File Upload */}
                    <div className="space-y-2">
                      <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Importer Modèle 3D (GLB)</label>
                      <input
                        type="file"
                        accept=".glb"
                        onChange={(e) => handleDishFileChange(e, "modelUrl")}
                        className="w-full bg-[#111111] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-[#CFCFCF] focus:outline-none file:mr-4 file:py-1 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E38A67]/20 file:text-[#EC9D7C] hover:file:bg-[#E38A67]/30 transition-all"
                      />
                      <input
                        type="url"
                        value={editingDish.modelUrl || ""}
                        onChange={(e) => setEditingDish({ ...editingDish, modelUrl: e.target.value })}
                        placeholder="URL du modèle .glb"
                        className="w-full bg-[#111111]/70 border border-white/10 rounded-xl py-2 px-3 text-xs text-[#9D9D9D] focus:outline-none focus:border-[#E38A67] transition-colors"
                      />
                    </div>

                    {/* USDZ File Upload */}
                    <div className="space-y-2">
                      <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Importer Modèle iOS (USDZ)</label>
                      <input
                        type="file"
                        accept=".usdz"
                        onChange={(e) => handleDishFileChange(e, "usdzUrl")}
                        className="w-full bg-[#111111] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-[#CFCFCF] focus:outline-none file:mr-4 file:py-1 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#E38A67]/20 file:text-[#EC9D7C] hover:file:bg-[#E38A67]/30 transition-all"
                      />
                      <input
                        type="url"
                        value={editingDish.usdzUrl || ""}
                        onChange={(e) => setEditingDish({ ...editingDish, usdzUrl: e.target.value })}
                        placeholder="URL du modèle .usdz"
                        className="w-full bg-[#111111]/70 border border-white/10 rounded-xl py-2 px-3 text-xs text-[#9D9D9D] focus:outline-none focus:border-[#E38A67] transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E38A67] to-[#C86F54] text-white tracking-[3px] uppercase text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <Save className="h-4 w-4 inline mr-2" />
                  <span>Enregistrer le Plat</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: Category Management Panel */}
          {activeTab === "categories" && !editingCategory && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg uppercase tracking-wider text-white">Toutes les catégories du menu</h2>
                <button
                  onClick={() => setEditingCategory({})}
                  className="flex items-center space-x-2 bg-[#E38A67] hover:bg-[#EC9D7C] text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter une catégorie</span>
                </button>
              </div>

              <div className="divide-y divide-white/5 glass-card rounded-2xl border border-white/5 p-6">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-mono text-[#9D9D9D]">#{cat.order}</span>
                        <h4 className="text-sm font-semibold">{cat.name}</h4>
                        {cat.isHidden && <span className="text-[8px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">Masqué</span>}
                      </div>
                      {cat.description && <p className="text-xs text-[#9D9D9D]">{cat.description}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:text-[#E38A67] transition-all"
                        aria-label="Edit category"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400 transition-all"
                        aria-label="Delete category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories Add/Edit Form view */}
          {activeTab === "categories" && editingCategory && (
            <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-md uppercase tracking-wider text-[#E38A67]">
                  {editingCategory.id ? "Modifier la Catégorie" : "Créer une Nouvelle Catégorie"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="text-xs tracking-widest text-[#9D9D9D] hover:text-white uppercase font-medium"
                >
                  Annuler
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">ID Technique Unique (sans espace)</label>
                    <input
                      type="text"
                      value={editingCategory.id || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, id: e.target.value })}
                      placeholder="nigiri"
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                      disabled={!!editingCategory.id}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Ordre d&apos;affichage</label>
                    <input
                      type="number"
                      value={editingCategory.order || ""}
                      onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                      placeholder="1"
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Nom de la Catégorie</label>
                  <input
                    type="text"
                    value={editingCategory.name || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder="Maki, Nigiri..."
                    className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Description</label>
                  <input
                    type="text"
                    value={editingCategory.description || ""}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    placeholder="Petite description..."
                    className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                  />
                </div>

                <div className="flex items-center space-x-3 py-2">
                  <input
                    type="checkbox"
                    id="isCatHidden"
                    checked={!!editingCategory.isHidden}
                    onChange={(e) => setEditingCategory({ ...editingCategory, isHidden: e.target.checked })}
                    className="accent-[#E38A67] h-4 w-4"
                  />
                  <label htmlFor="isCatHidden" className="text-xs uppercase tracking-wider text-[#CFCFCF]">Masquer la catégorie de la carte</label>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E38A67] to-[#C86F54] text-white tracking-[3px] uppercase text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <span>Enregistrer la Catégorie</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Promo Offers Banners Management */}
          {activeTab === "offers" && !editingOffer && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg uppercase tracking-wider text-white">Bannières promotionnelles active</h2>
                <button
                  onClick={() => setEditingOffer({})}
                  className="flex items-center space-x-2 bg-[#E38A67] hover:bg-[#EC9D7C] text-white px-4 py-2 rounded-xl text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter une offre</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((offer) => (
                  <div key={offer.id} className="glass-card border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between h-[200px]">
                    <div 
                      className="h-28 bg-cover bg-center p-4 relative"
                      style={{ backgroundImage: `url('${offer.image}')` }}
                    >
                      <div className="absolute inset-0 bg-[#050505]/40" />
                      <div className="relative z-10">
                        <h4 className="text-sm font-semibold">{offer.title}</h4>
                        <p className="text-xs text-[#CFCFCF] line-clamp-1">{offer.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 flex items-center justify-between border-t border-white/5 bg-[#111111]/30">
                      <span className={`text-[9px] uppercase px-2 py-0.5 rounded font-medium ${offer.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                        {offer.isActive ? "Active" : "Désactivée"}
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingOffer(offer)}
                          className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 hover:text-[#E38A67]"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteOffer(offer.id)}
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offers Add/Edit Form view */}
          {activeTab === "offers" && editingOffer && (
            <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h3 className="text-md uppercase tracking-wider text-[#E38A67]">
                  {editingOffer.id ? "Modifier l'Offre" : "Créer une Nouvelle Offre"}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingOffer(null)}
                  className="text-xs tracking-widest text-[#9D9D9D] hover:text-white uppercase font-medium"
                >
                  Annuler
                </button>
              </div>

              <form onSubmit={handleSaveOffer} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Titre de la bannière</label>
                  <input
                    type="text"
                    value={editingOffer.title || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })}
                    placeholder="Symphonie de Daurade..."
                    className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Sous-titre / Description courte</label>
                  <input
                    type="text"
                    value={editingOffer.subtitle || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, subtitle: e.target.value })}
                    placeholder="Une explosion de saveurs..."
                    className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">URL Image de fond (WebP/AVIF)</label>
                  <input
                    type="url"
                    value={editingOffer.image || ""}
                    onChange={(e) => setEditingOffer({ ...editingOffer, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Associer au plat (Facultatif - ID Plat)</label>
                    <select
                      value={editingOffer.dishId || ""}
                      onChange={(e) => setEditingOffer({ ...editingOffer, dishId: e.target.value })}
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                    >
                      <option value="">Aucun</option>
                      {dishes.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-3 py-4">
                    <input
                      type="checkbox"
                      id="isOfferActive"
                      checked={editingOffer.isActive !== false}
                      onChange={(e) => setEditingOffer({ ...editingOffer, isActive: e.target.checked })}
                      className="accent-[#E38A67] h-4 w-4"
                    />
                    <label htmlFor="isOfferActive" className="text-xs uppercase tracking-wider text-[#CFCFCF]">Activer l&apos;offre</label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E38A67] to-[#C86F54] text-white tracking-[3px] uppercase text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  <span>Enregistrer l&apos;Offre</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: Restaurant Settings & QR Code Generator */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Settings Form */}
              <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-6">
                <h3 className="text-sm uppercase tracking-widest text-[#E38A67] border-b border-white/5 pb-2">Métadonnées du Restaurant</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Nom de l&apos;établissement</label>
                    <input
                      type="text"
                      value={restaurantSettings.name}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, name: e.target.value })}
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Slogan / Description courte</label>
                    <input
                      type="text"
                      value={restaurantSettings.tagline}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, tagline: e.target.value })}
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Adresse Physique</label>
                    <input
                      type="text"
                      value={restaurantSettings.address}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, address: e.target.value })}
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9D9D9D] uppercase tracking-wider mb-2">Horaires d&apos;ouverture</label>
                    <input
                      type="text"
                      value={restaurantSettings.hours}
                      onChange={(e) => setRestaurantSettings({ ...restaurantSettings, hours: e.target.value })}
                      className="w-full bg-[#111111] border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-[#E38A67] transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={() => alert("Paramètres enregistrés avec succès !")}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#E38A67] to-[#C86F54] text-white tracking-[3px] uppercase text-xs font-semibold shadow-lg transition-all"
                >
                  <span>Enregistrer les paramètres</span>
                </button>
              </div>

              {/* QR Code generator */}
              <div className="glass-card border border-white/5 rounded-2xl p-6 flex flex-col justify-between items-center text-center space-y-6">
                <div>
                  <h3 className="text-sm uppercase tracking-widest text-[#E38A67]">Générateur QR Menu</h3>
                  <p className="text-xs text-[#9D9D9D] mt-2">Générez instantanément le QR code à imprimer pour vos tables.</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-white/10 shadow-2xl">
                  <img
                    src={getQrCodeUrl(typeof window !== "undefined" ? `${window.location.origin}/menu` : "https://kayusushi.com/menu")}
                    alt="QR Menu code digital"
                    className="w-48 h-48"
                  />
                </div>

                <div className="w-full space-y-2">
                  <p className="text-[10px] text-[#9D9D9D]">Lien encodé: <span className="text-[#E38A67]">{typeof window !== "undefined" ? `${window.location.origin}/menu` : "https://kayusushi.com/menu"}</span></p>
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = getQrCodeUrl(typeof window !== "undefined" ? `${window.location.origin}/menu` : "https://kayusushi.com/menu");
                      link.download = "qrcode-menu-kayu.png";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    Télécharger le QR Code
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Admin Panel Footer */}
      <footer className="w-full flex flex-col items-center py-6 text-center text-[#9D9D9D] border-t border-white/5 bg-[#111111]/30">
        <p className="text-[9px] tracking-[4px] uppercase text-[#E38A67]">
          KAYU SUSHI ADMIN CONSOLE • PROPULSÉ PAR EASYMENU
        </p>
      </footer>
    </div>
  );
}
