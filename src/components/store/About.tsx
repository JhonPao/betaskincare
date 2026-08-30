"use client";

import React from "react";
import { Sparkles, ShieldCheck, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";

export const About: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-primary-dark" />,
      title: "Productos 100% Originales",
      desc: "Importados directamente de Corea del Sur. Garantizamos la autenticidad y calidad de cada fórmula en nuestro catálogo."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-brand-primary-dark" />,
      title: "Lo Último en K-Beauty",
      desc: "Traemos las tendencias más virales e innovadoras del cuidado facial coreano para que logres tu rutina perfecta y hacemos envios a cualquier parte del Perú."
    },
    {
      icon: <Heart className="w-6 h-6 text-brand-primary-dark" />,
      title: "Cuidado Consciente",
      desc: "Fórmulas respetuosas con tu barrera cutánea, libres de crueldad animal y seleccionadas meticulosamente para todo tipo de piel."
    }
  ];

  return (
    <section id="about" className="py-24 px-6 bg-white relative overflow-hidden scroll-mt-10">
      {/* Círculos flotantes de fondo */}
      <div className="absolute w-[250px] h-[250px] rounded-full bg-brand-secondary/15 -bottom-20 -right-20 blur-2xl pointer-events-none" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-brand-primary-light/40 -top-20 -left-20 blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Imagen izquierda */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-lg border border-brand-primary-dark/10 bg-linear-to-tr from-brand-primary-light/30 to-brand-secondary/30 p-8 flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=600&h=450&fit=crop" 
              alt="Skincare Coreano Rutina K-Beauty" 
              className="rounded-2xl object-cover w-full h-full shadow-sm"
              loading="lazy"
            />
            {/* Tarjeta flotante pequeña */}
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-brand-primary-dark/10 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-accent-light rounded-xl flex items-center justify-center text-brand-accent-main font-bold">
                5★
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Calidad Garantizada</h4>
                <p className="text-[10px] text-brand-text-light">Clientes 100% satisfechos en Perú</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contenido derecha */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col"
        >
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-brand-primary-dark mb-3">
            Quiénes Somos
          </span>
          
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">
            Tu destino de confianza para el cuidado de tu piel
          </h2>

          <p className="text-sm text-brand-text-light leading-relaxed mb-8">
            En <strong>BetaSkinCare</strong>, creemos que una piel radiante no es cuestión de suerte, sino de constancia y los productos correctos. Nos apasiona la filosofía de belleza coreana (K-Beauty), que prioriza la salud, hidratación profunda y protección a largo plazo de la barrera cutánea. Ofrecemos asesoramiento personalizado y envío rápido a todo el país para que disfrutes de la experiencia original K-Beauty en casa.
          </p>

          {/* Características */}
          <div className="space-y-6">
            {features.map((feat, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary-light/50 flex items-center justify-center shrink-0 border border-brand-primary-dark/10">
                  {feat.icon}
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-foreground mb-1">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-brand-text-light leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
