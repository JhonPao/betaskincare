"use client";

import React from "react";
import { Logo } from "@/components/ui/Logo";
import { Phone, MapPin, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="footer" className="bg-stone-100 border-t border-brand-primary-dark/15 text-brand-text pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
        {/* Marca */}
        <div className="flex flex-col gap-4">
          <a href="#hero" onClick={(e) => handleScrollTo(e, "hero")} className="flex items-center gap-2 group">
            <Logo size="sm" />
            <span className="font-serif text-xl font-semibold tracking-tight">
              Beta<span className="text-brand-primary-dark">SkinCare</span>
            </span>
          </a>
          <p className="text-xs text-brand-text-light leading-relaxed">
            Tu destino de confianza para skincare coreano de alta calidad. Descubre el secreto de una piel radiante con nuestros productos originales seleccionados de K-Beauty.
          </p>
          <div className="flex gap-3 mt-2">
            <a 
              href="https://instagram.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border border-brand-primary-dark/10 flex items-center justify-center text-brand-text-light hover:text-brand-primary-dark hover:border-brand-primary-dark/40 hover:scale-105 transition-all shadow-xs"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://facebook.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white border border-brand-primary-dark/10 flex items-center justify-center text-brand-text-light hover:text-brand-primary-dark hover:border-brand-primary-dark/40 hover:scale-105 transition-all shadow-xs"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Links de Ayuda */}
        <div>
          <h4 className="font-serif text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
            Ayuda
          </h4>
          <ul className="space-y-2.5 text-xs text-brand-text-light">
            <li><a href="#" className="hover:text-brand-primary-dark transition-colors">Preguntas Frecuentes</a></li>
            <li><a href="#" className="hover:text-brand-primary-dark transition-colors">Envíos y Entregas</a></li>
            <li><a href="#" className="hover:text-brand-primary-dark transition-colors">Política de Devoluciones</a></li>
            <li><a href="#" className="hover:text-brand-primary-dark transition-colors">Términos y Condiciones</a></li>
          </ul>
        </div>

        {/* Links Rápidos */}
        <div>
          <h4 className="font-serif text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
            Enlaces
          </h4>
          <ul className="space-y-2.5 text-xs text-brand-text-light">
            <li>
              <a href="#hero" onClick={(e) => handleScrollTo(e, "hero")} className="hover:text-brand-primary-dark transition-colors">
                Inicio
              </a>
            </li>
            <li>
              <a href="#products" onClick={(e) => handleScrollTo(e, "products")} className="hover:text-brand-primary-dark transition-colors">
                Catálogo de Productos
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleScrollTo(e, "about")} className="hover:text-brand-primary-dark transition-colors">
                Sobre Nosotros
              </a>
            </li>
            <li>
              <a href="#footer" onClick={(e) => handleScrollTo(e, "footer")} className="hover:text-brand-primary-dark transition-colors">
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Información de Contacto */}
        <div>
          <h4 className="font-serif text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
            Contacto
          </h4>
          <ul className="space-y-3 text-xs text-brand-text-light">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-primary-dark shrink-0" />
              <span>973 468 722</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-primary-dark shrink-0" />
              <span>912 667 200</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-primary-dark shrink-0" />
              <span>Cajamarca, Perú</span>
            </li>
            <li className="flex items-center gap-1 mt-2 text-[10px] bg-brand-primary-light/50 border border-brand-primary-dark/10 p-2 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary-dark shrink-0" />
              <span>Envíos rápidos a todo el Perú y asesoría de rutina gratuita.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-brand-primary-dark/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-brand-text-muted">
        <span>© {new Date().getFullYear()} BetaSkinCare. Todos los derechos reservados.</span>
        <span>K-Beauty Skincare Original en Perú.</span>
      </div>
    </footer>
  );
};
