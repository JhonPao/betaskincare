"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Award } from "lucide-react";
import { CategoryItem, getCategoriesFromFirebase, DEFAULT_CATEGORIES } from "@/lib/firebase";

interface BrandsSectionProps {
  onSelectBrand?: (brandId: string) => void;
}

export const BrandsSection: React.FC<BrandsSectionProps> = ({ onSelectBrand }) => {
  const [brands, setBrands] = useState<CategoryItem[]>([]);

  useEffect(() => {
    async function loadBrands() {
      try {
        const cached = localStorage.getItem("betaskincare_categories");
        if (cached) {
          try {
            const parsed: CategoryItem[] = JSON.parse(cached);
            const cachedBrands = parsed.filter(c => c.type === "brand");
            if (cachedBrands.length > 0) setBrands(cachedBrands);
          } catch {}
        }

        const data = await getCategoriesFromFirebase();
        const firebaseBrands = data.filter(c => c.type === "brand");
        if (firebaseBrands.length > 0) {
          setBrands(firebaseBrands);
        } else {
          setBrands(DEFAULT_CATEGORIES.filter(c => c.type === "brand"));
        }
      } catch (error) {
        console.error("Error cargando marcas en Storefront:", error);
        setBrands(DEFAULT_CATEGORIES.filter(c => c.type === "brand"));
      }
    }

    loadBrands();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section id="brands" className="py-20 px-6 bg-white relative overflow-hidden scroll-mt-10 border-t border-brand-primary-dark/10">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera de la Sección */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-brand-primary-dark mb-2.5 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Marcas Exclusivas
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            El Reino de la Cosmética Coreana, en tus Manos
          </h2>
          <p className="text-sm text-brand-text-light leading-relaxed">
            Acercamos a ti las marcas más icónicas de K-Beauty, traídas directamente desde Corea del Sur para el cuidado de tu piel.
          </p>
        </div>

        {/* Grid de Marcas Dinámicas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              onClick={() => onSelectBrand?.(brand.id)}
              className="group bg-stone-50 rounded-3xl p-6 border border-brand-primary-dark/10 hover:border-brand-primary-dark/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-brand-primary-light text-brand-primary-dark font-bold">
                  {brand.badge || "K-Beauty Original"}
                </span>
                <Award className="w-4 h-4 text-brand-accent-main" />
              </div>

              {/* Contenido */}
              <div className="mb-6">
                <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-brand-primary-dark transition-colors mb-2">
                  {brand.label}
                </h3>
                <p className="text-xs text-brand-text-light leading-relaxed">
                  {brand.tagline || "Fórmulas cosméticas de alta efectividad importadas directamente desde Corea del Sur."}
                </p>
              </div>

              {/* Mini Preview de Imagen de Marca */}
              <div className="relative aspect-5/2 rounded-2xl overflow-hidden bg-white border border-stone-200">
                {brand.image ? (
                  <img 
                    src={brand.image} 
                    alt={brand.label} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-primary-light/30 flex items-center justify-center text-brand-primary-dark font-serif font-bold text-lg">
                    {brand.label}
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 right-3 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                  Ver productos →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
