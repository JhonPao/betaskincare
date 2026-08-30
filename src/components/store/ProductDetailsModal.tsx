"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/firebase";
import { useCart } from "@/context/CartContext";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Truck, Calendar, ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const { addToCart, updateQuantity, cart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQty(1);
      setActiveImageIndex(0);
    }
  }, [isOpen, product]);

  if (!product) return null;

  // Lista de imágenes (imagen principal + secundarias)
  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image].filter(Boolean);

  const currentImage = allImages[activeImageIndex] || allImages[0];

  const finalPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  const isSoldOut = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  const handleIncrement = () => {
    if (qty < product.stock) {
      setQty(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (qty > 1) {
      setQty(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    
    const cartItem = cart.find(item => item.product.id === product.id);
    if (cartItem) {
      const newQty = Math.min(cartItem.quantity + qty, product.stock);
      updateQuantity(product.id, newQty);
    }

    onClose();
  };

  const nextImage = () => {
    setActiveImageIndex(prev => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(<Star key={i} className="w-4 h-4 fill-brand-accent-main text-brand-accent-main" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-stone-300" />);
      }
    }
    return stars;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[94vw] max-w-3xl sm:max-w-3xl md:max-w-4xl bg-white border border-brand-primary-dark/15 rounded-3xl p-5 sm:p-8 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="hidden">
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mt-4">
          {/* Galería de imágenes (Carrusel) */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square bg-linear-to-br from-brand-primary-light/35 to-brand-secondary/20 rounded-2xl flex items-center justify-center p-6 overflow-hidden border border-brand-primary-dark/10">
              <AnimatePresence mode="wait">
                {currentImage && currentImage.trim() !== "" ? (
                  <motion.img 
                    key={currentImage}
                    src={currentImage} 
                    alt={product.name} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-300 gap-1">
                    <ShoppingCart className="w-12 h-12 stroke-[1.5]" />
                    <span className="text-[10px] font-semibold text-stone-400">Sin Foto Disponible</span>
                  </div>
                )}
              </AnimatePresence>

              {product.discount > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-xs z-10">
                  -{product.discount}% Descuento
                </span>
              )}

              {/* Botones de navegación del carrusel */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-white shadow-md cursor-pointer transition-all z-10"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-white shadow-md cursor-pointer transition-all z-10"
                    aria-label="Siguiente imagen"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas de imágenes secundarias */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl border p-1 bg-stone-50 overflow-hidden shrink-0 cursor-pointer transition-all ${
                      activeImageIndex === idx 
                        ? "border-brand-primary-dark ring-2 ring-brand-primary-dark/20 scale-105" 
                        : "border-stone-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del Producto */}
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-brand-primary-dark tracking-wider uppercase">
                {product.categoryLabel}
              </span>
              {product.brand && (
                <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-md text-stone-600 font-semibold">
                  {product.brand}
                </span>
              )}
            </div>
            
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground leading-tight mb-3">
              {product.name}
            </h2>

            {/* Estrellas y reviews */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-xs text-brand-text-muted">({product.reviewCount} opiniones)</span>
            </div>

            <div className="h-[1px] bg-brand-primary-dark/10 w-full my-1" />

            {/* Estado del stock */}
            <div className="my-3">
              {isSoldOut ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  ❌ Agotado temporalmente
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  ⚠️ ¡Solo quedan {product.stock} unidades en stock!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  ✅ Disponible en stock ({product.stock} unids)
                </span>
              )}
            </div>

            {/* Método de Entrega */}
            <div className="mb-4 text-xs text-stone-600 space-y-1">
              {product.delivery === "inmediata" ? (
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-green-600 shrink-0" />
                  <span><strong>Entrega Inmediata:</strong> Disponible para entrega rápida hoy en Cajamarca para otros distritos y provincias disponible por envio.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Pedido a Distribuidor:</strong> {product.shippingTime || "7-10 días hábiles"}.</span>
                </div>
              )}
            </div>

            <div className="h-[1px] bg-brand-primary-dark/10 w-full my-1" />

            {/* Precios */}
            <div className="flex items-baseline gap-3 my-4">
              <span className="text-3xl font-extrabold text-foreground">
                S/. {finalPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <span className="text-base text-brand-text-muted line-through font-medium">
                  S/. {product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Cantidad y Agregar */}
            {!isSoldOut && (
              <div className="flex items-center gap-4 mt-auto pt-4">
                <div className="flex items-center border border-stone-200 rounded-full bg-stone-50 p-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleDecrement}
                    disabled={qty <= 1}
                    className="w-8 h-8 rounded-full cursor-pointer hover:bg-stone-200 disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="w-8 text-center font-semibold text-sm">{qty}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleIncrement}
                    disabled={qty >= product.stock}
                    className="w-8 h-8 rounded-full cursor-pointer hover:bg-stone-200 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-linear-to-r from-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-primary text-white font-semibold py-6 shadow-md hover:shadow-lg cursor-pointer transition-all duration-300"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Agregar al Carrito
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
