"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Compass } from "lucide-react";
import KayuLogo from "@/components/KayuLogo";

// Web Audio API Sound Generator for Japanese Pentatonic Chime
const playChime = (hasSound: boolean) => {
  if (!hasSound) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioContextClass();
    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      
      // Gentle attack and decay envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // Japanese Pentatonic Scale (In Sen scale: C, Db, F, G, Bb)
    // Plays a soft cascading arpeggio
    const now = ctx.currentTime;
    playNote(523.25, now, 2.5); // C5
    playNote(587.33, now + 0.2, 2.3); // D5
    playNote(698.46, now + 0.45, 2.0); // F5
    playNote(783.99, now + 0.7, 1.8); // G5
    playNote(1046.50, now + 1.0, 1.5); // C6
  } catch (e) {
    console.error("Audio failed to initialize:", e);
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [loadingStep, setLoadingStep] = useState(0); // 0: Welcome, 1: Powered by, 2: Loaded
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  // Generate particles client-side
  useEffect(() => {
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, []);

  // Loading Screen steps
  useEffect(() => {
    if (loadingStep === 0) {
      const timer = setTimeout(() => {
        setLoadingStep(1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (loadingStep === 1) {
      const timer = setTimeout(() => {
        setLoadingStep(2);
        playChime(soundEnabled);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loadingStep, soundEnabled]);

  const handleExplore = () => {
    playChime(soundEnabled);
    router.push("/menu");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] flex flex-col justify-between overflow-hidden">
      
      {/* Cinematic Background Images / Gradients */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-[0.25] transition-opacity duration-1000 mix-blend-luminosity scale-105 pointer-events-none"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2000&auto=format&fit=crop')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/85 to-[#050505] pointer-events-none" />

      {/* Floating Particle Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#E38A67]/25"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
            animate={{
              y: ["0px", "-120px"],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Steam Smoke effect in Zen corner */}
      <div className="absolute bottom-0 right-0 w-[45vw] h-[60vh] overflow-hidden pointer-events-none opacity-30 select-none">
        <div className="absolute bottom-0 right-10 w-24 h-96 bg-gradient-to-t from-[#E38A67]/5 to-transparent blur-3xl animate-steam" />
        <div className="absolute bottom-0 right-24 w-32 h-[450px] bg-gradient-to-t from-white/3 to-transparent blur-3xl animate-steam" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Header controls */}
      <header className="z-20 w-full flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center space-x-2 text-[11px] tracking-[4px] uppercase text-[#9D9D9D]">
          <span>TOKYO</span>
          <span className="text-[#E38A67]">•</span>
          <span>PARIS</span>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center justify-center p-2 rounded-full border border-white/5 hover:border-white/20 transition-colors text-[#CFCFCF] hover:text-[#FFFFFF]"
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
      </header>

      {/* Loading Animation overlays */}
      <AnimatePresence mode="wait">
        {loadingStep < 2 && (
          <motion.div
            key="loader"
            className="absolute inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center"
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          >
            <div className="relative flex flex-col items-center justify-center px-4 text-center">
              
              {/* Brush stroke outer logo path */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5 }}
                className="mb-8 scale-[0.8]"
              >
                <KayuLogo light={true} className="h-28 w-auto" />
              </motion.div>

              {/* Text Loading progression */}
              <div className="h-10 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {loadingStep === 0 && (
                    <motion.p
                      key="welcome"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6 }}
                      className="text-[14px] uppercase tracking-[8px] text-[#FFFFFF]"
                    >
                      BIENVENUE CHEZ KAYU
                    </motion.p>
                  )}
                  {loadingStep === 1 && (
                    <motion.p
                      key="powered"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6 }}
                      className="text-[11px] uppercase tracking-[6px] text-[#9D9D9D]"
                    >
                      Propulsé par <span className="text-[#E38A67] tracking-[8px] ml-1">EASYMENU</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Cinematic Landing Hero Content */}
      <main className="z-10 flex flex-col items-center justify-center flex-grow px-4 md:px-12 text-center select-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center max-w-lg"
        >
          {/* Logo */}
          <div className="mb-4 scale-110">
            <KayuLogo light={true} />
          </div>

          <p className="text-[14px] md:text-[16px] tracking-[6px] text-[#CFCFCF] uppercase font-light mb-8 max-w-sm">
            L&apos;ART CULINAIRE JAPONAIS EN RÉALITÉ AUGMENTÉE
          </p>

          <div className="w-12 h-[1px] bg-[#E38A67]/60 mb-12" />

          {/* Premium Call to Action */}
          <motion.button
            onClick={handleExplore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-center justify-center space-x-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#E38A67] to-[#C86F54] text-white tracking-[4px] uppercase text-[12px] font-medium shadow-[0_0_30px_rgba(227,138,103,0.35)] hover:shadow-[0_0_40px_rgba(227,138,103,0.55)] transition-all duration-300"
          >
            <span>Explorer la Carte</span>
            <Compass className="h-4 w-4 transition-transform group-hover:rotate-45 duration-500" />
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </motion.div>
      </main>
      {/* Footer Branding with branch listings */}
      <footer className="z-20 w-full flex flex-col items-center py-8 text-center text-[#9D9D9D] space-y-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 text-xs text-[#9D9D9D] w-full border-t border-white/5 pt-8">
          <div className="space-y-1">
            <h4 className="text-white font-medium uppercase tracking-wider text-glow">KAYU SFAX</h4>
            <p className="font-light">Route Teniour, Av. Abdelaziz Thaalbi</p>
            <p className="text-[#E38A67] font-mono">+216 25 96 66 67</p>
            <p className="opacity-75">Sfax@kayusushi.com</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-medium uppercase tracking-wider text-glow">KAYU TUNIS (Le Kram)</h4>
            <p className="font-light">Jardins de Carthage, Imm. Montazah</p>
            <p className="text-[#E38A67] font-mono">+216 25 26 66 67</p>
            <p className="opacity-75">Hello@kayusushi.com</p>
          </div>
          <div className="space-y-1">
            <h4 className="text-white font-medium uppercase tracking-wider text-glow">KAYU TUNIS (La Marsa)</h4>
            <p className="font-light">Sidi Daoud, rte station shell</p>
            <p className="text-[#E38A67] font-mono">+216 28 336 667</p>
            <p className="opacity-75">Hello@kayusushi.com</p>
          </div>
        </div>

        <div className="text-[10px] tracking-[3px] uppercase opacity-75 pt-4">
          <span>SFAX • TUNIS</span>
          <span className="mx-3 opacity-30">|</span>
          <span>© {new Date().getFullYear()} KAYU SUSHI</span>
        </div>
        <p className="text-[9px] tracking-[4px] uppercase text-[#E38A67] hover:opacity-85 transition-opacity">
          PROPULSÉ PAR EASYMENU
        </p>
      </footer>
    </div>
  );
}
