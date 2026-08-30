"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Award } from "lucide-react";

export interface BrandItem {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  image: string;
}

export const BRANDS_LIST: BrandItem[] = [
  {
    id: "cosrx",
    name: "COSRX",
    tagline: "Fórmulas minimalistas de alta efectividad con mucina de caracol y BHA",
    badge: "Top Ventas K-Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop"
  },
  {
    id: "beauty-of-joseon",
    name: "Beauty of Joseon",
    tagline: "Medicina tradicional coreana (Hanbang) infusionada con ciencia moderna",
    badge: "Viral Mundial",
    image: "https://images.unsplash.com/photo-1608248597263-0057e05b4b74?w=400&h=300&fit=crop"
  },
  {
    id: "anua",
    name: "Anua",
    tagline: "Especialistas en calmar pieles sensibles y propensas al acné con Heartleaf",
    badge: "Piel Radiante",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop"
  },
  {
    id: "skin1004",
    name: "SKIN1004",
    tagline: "Centella Asiática pura de Madagascar para restaurar y calmar tu rostro",
    badge: "100% Botánico",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop"
  },
  {
    id: "round-lab",
    name: "Round Lab",
    tagline: "Hidratación profunda con agua de las profundidades de la Isla Dokdo",
    badge: "Nº1 en Corea",
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=300&fit=crop"
  },
  {
    id: "laneige",
    name: "Laneige",
    tagline: "Expertos en barrera de humedad y mascarillas labiales icónicas",
    badge: "Lujo Accesible",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=300&fit=crop"
  }
];

interface BrandsSectionProps {
  onSelectBrand?: (brandId: string) => void;
}

export const BrandsSection: React.FC<BrandsSectionProps> = ({ onSelectBrand }) => {
  return (
    <section id="brands" className="py-20 px-6 bg-white relative overflow-hidden scroll-mt-10 border-t border-brand-primary-dark/10">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera de la Sección */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-brand-primary-dark mb-2.5 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Marcas Exclusivas
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Nuestras Marcas de Corea del Sur
          </h2>
          <p className="text-sm text-brand-text-light leading-relaxed">
            Trabajamos con las casas cosméticas más prestigiosas y recomendadas por dermatólogos en Seúl.
          </p>
        </div>

        {/* Grid de Marcas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {BRANDS_LIST.map((brand, idx) => (
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
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-brand-primary-light text-brand-primary-dark">
                  {brand.badge}
                </span>
                <Award className="w-4 h-4 text-brand-accent-main" />
              </div>

              {/* Contenido */}
              <div className="mb-6">
                <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-brand-primary-dark transition-colors mb-2">
                  {brand.name}
                </h3>
                <p className="text-xs text-brand-text-light leading-relaxed">
                  {brand.tagline}
                </p>
              </div>

              {/* Mini Preview de Imagen de Marca */}
              <div className="relative aspect-5/2 rounded-2xl overflow-hidden bg-white border border-stone-200">
                <img 
                  src={brand.image} 
                  alt={brand.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
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
