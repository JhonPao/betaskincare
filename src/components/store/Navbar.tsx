"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Logo } from "@/components/ui/Logo";

interface NavbarProps {
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ["hero", "products", "about", "footer"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "hero", label: "Inicio" },
    { id: "products", label: "Catálogo" },
    { id: "brands", label: "Marcas" },
    { id: "about", label: "Nosotros" },
    { id: "footer", label: "Contacto" }
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-stone-50/90 backdrop-blur-md shadow-sm border-b border-brand-primary-dark/10 py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" onClick={(e) => handleLinkClick(e, "hero")} className="flex items-center gap-2 group">
          <Logo size="md" />
          <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">
            Beta<span className="text-brand-primary-dark font-serif">SkinCare</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className={`text-sm font-medium relative py-1 transition-colors hover:text-foreground ${
                activeSection === link.id ? "text-foreground font-semibold" : "text-muted-foreground"
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <motion.span 
                  layoutId="activeUnderline"
                  className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-primary to-brand-primary-dark rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button 
            onClick={onCartClick}
            className="relative w-10 h-10 rounded-full bg-brand-primary-light flex items-center justify-center text-brand-primary-dark hover:bg-primary hover:text-white transition-all hover:scale-105 cursor-pointer shadow-xs"
            aria-label="Ver carrito"
          >
            <ShoppingBag className="w-5 h-5" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-brand-primary-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Hamburger Menu Icon (Mobile Only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-brand-primary-dark transition-colors cursor-pointer"
            aria-label="Menu principal"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-b border-brand-primary-dark/10 bg-stone-50/95 backdrop-blur-lg overflow-hidden shadow-md"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleLinkClick(e, link.id)}
                  className={`text-base font-medium py-2 transition-colors ${
                    activeSection === link.id ? "text-brand-primary-dark font-semibold pl-2 border-l-2 border-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
