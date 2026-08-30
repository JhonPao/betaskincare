"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export const Hero: React.FC = () => {
  const handleScrollToProducts = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = document.getElementById("products");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-brand-primary-light via-brand-bg to-brand-secondary py-20 px-6"
    >
      {/* Círculos decorativos flotantes */}
      <motion.div 
        animate={{ y: [0, -25, 0], scale: [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute w-[400px] h-[400px] rounded-full bg-primary/15 -top-[100px] -right-[100px] blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
        className="absolute w-[300px] h-[300px] rounded-full bg-secondary/20 -bottom-[50px] -left-[80px] blur-2xl pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
        className="absolute w-[180px] h-[180px] rounded-full bg-brand-accent-main/10 top-[40%] left-[10%] blur-xl pointer-events-none"
      />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center z-10">
        {/* Contenido Izquierda */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center md:text-left flex flex-col items-center md:items-start"
        >
          <div className="inline-flex items-center gap-2 bg-white/70 border border-brand-primary-dark/20 px-4 py-2 rounded-full text-xs font-semibold text-brand-primary-dark shadow-xs backdrop-blur-md mb-6">
            ✦ Skin Care Coreano Original | Envíos a todo el Perú
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-[1.1] mb-6">
            Descubre el secreto de una <br />
            <span className="bg-linear-to-r from-brand-primary-dark to-brand-accent-main bg-clip-text text-transparent">
              piel de porcelana
            </span>
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-md leading-relaxed mb-8">
            Skincare coreano de alta calidad para hidratar, proteger y realzar tu belleza natural. Tu inversión a largo plazo para un rostro radiante.
          </p>

          <button
            onClick={handleScrollToProducts}
            className="inline-flex items-center gap-2 bg-linear-to-r from-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-primary text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
          >
            Ver Catálogo
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Imagen Derecha */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="flex justify-center items-center"
        >
          <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] flex items-center justify-center">
            {/* Blob de fondo con morphing */}
            <motion.div 
              animate={{ 
                borderRadius: [
                  "60% 40% 55% 45% / 45% 55% 45% 55%",
                  "45% 55% 40% 60% / 55% 45% 55% 45%",
                  "55% 45% 60% 40% / 50% 50% 45% 55%",
                  "60% 40% 55% 45% / 45% 55% 45% 55%"
                ] 
              }}
              transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
              className="absolute inset-0 bg-linear-to-tr from-brand-primary-light via-brand-secondary/50 to-brand-primary-light/40 shadow-xs"
            />

            {/* Imagen del producto flotando */}
            <motion.div
              animate={{ y: [0, -12, 0], rotate: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute inset-6 flex items-center justify-center"
            >
              <img 
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&h=500&fit=crop&crop=center" 
                alt="Hyalu-Cica Water-Fit Sun Serum - Producto destacado BetaSkinCare"
                className="w-[85%] h-[85%] object-contain drop-shadow-[0_15px_30px_rgba(90,74,66,0.18)]"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-brand-text-muted text-[10px] tracking-widest uppercase pointer-events-none">
        <span>Deslizar</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-[1px] h-10 bg-linear-to-b from-primary to-transparent"
        />
      </div>
    </section>
  );
};
