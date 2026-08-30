"use client";

import React from "react";
import { Product } from "@/lib/firebase";
import { useCart } from "@/context/CartContext";
import { Star, Truck, Calendar, ShoppingCart, Eye, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails, index }) => {
  const { addToCart } = useCart();

  const finalPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  const isSoldOut = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  // Renderizar estrellas
  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-brand-accent-main text-brand-accent-main" />);
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-stone-300" />);
      }
    }
    return stars;
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={() => onOpenDetails(product)}
      className="group bg-white rounded-3xl overflow-hidden border border-brand-primary-dark/8 shadow-xs hover:shadow-xl hover:border-brand-primary-dark/20 transition-all duration-300 flex flex-col relative cursor-pointer"
    >
      {/* Badges en la parte superior */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.badge && (
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full text-white shadow-xs ${
            product.badge.toLowerCase() === "nuevo" 
              ? "bg-linear-to-r from-brand-secondary-dark to-secondary" 
              : "bg-linear-to-r from-primary to-brand-primary-dark"
          }`}>
            {product.badge}
          </span>
        )}
        
        {product.discount > 0 && (
          <span className="bg-red-500 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-xs w-fit">
            -{product.discount}%
          </span>
        )}

        {isSoldOut && (
          <span className="bg-stone-500 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs w-fit">
            Agotado
          </span>
        )}

        {isLowStock && (
          <span className="bg-orange-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-xs w-fit">
            ¡Solo quedan {product.stock}!
          </span>
        )}
      </div>

      {/* Imagen del producto */}
      <div className="relative aspect-square p-6 bg-linear-to-br from-brand-primary-light/40 to-brand-secondary/20 flex items-center justify-center overflow-hidden">
        {product.image && product.image.trim() !== "" ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-[75%] h-[75%] object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-300 gap-1">
            <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
            <span className="text-[10px] font-semibold text-stone-400">Sin Imagen</span>
          </div>
        )}
        {/* Overlay en Hover */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-text shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Información */}
      <div className="p-5 flex-1 flex flex-col">
        <span className="text-xs font-semibold text-brand-primary-dark tracking-wider uppercase mb-1">
          {product.categoryLabel}
        </span>
        
        <h3 className="font-serif text-base font-semibold text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-brand-primary-dark transition-colors">
          {product.name}
        </h3>

        {/* Calificación */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-xs text-brand-text-muted">({product.reviewCount})</span>
        </div>

        {/* Tipo de entrega */}
        <div className="mt-auto mb-4">
          {product.delivery === "inmediata" ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-md border border-green-100">
              <Truck className="w-3 h-3" /> Entrega Inmediata
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
              <Calendar className="w-3 h-3" /> Pedido a Distribuidor {product.shippingTime && `~${product.shippingTime}`}
            </span>
          )}
        </div>

        {/* Precios y Botón */}
        <div className="flex items-center justify-between pt-3 border-t border-brand-primary-dark/5">
          <div className="flex flex-col">
            {product.discount > 0 ? (
              <>
                <span className="text-lg font-bold text-foreground leading-none">
                  S/. {finalPrice.toFixed(2)}
                </span>
                <span className="text-xs text-brand-text-muted line-through mt-0.5">
                  S/. {product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-foreground">
                S/. {product.price.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            disabled={isSoldOut}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="rounded-full bg-linear-to-r from-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-primary text-white font-semibold flex items-center gap-1.5 px-4 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isSoldOut ? "Agotado" : "Añadir"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
};
