"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/lib/firebase";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingForm {
  name: string;
  district: string;
  address: string;
  reference: string;
  method: "delivery" | "pickup";
  payment: "yape" | "plin" | "transferencia" | "efectivo" | string;
}

interface CartContextType {
  cart: CartItem[];
  shippingForm: ShippingForm;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  updateShippingForm: (form: Partial<ShippingForm>) => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  checkoutWhatsApp: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialForm: ShippingForm = {
  name: "",
  district: "",
  address: "",
  reference: "",
  method: "delivery",
  payment: "yape"
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingForm, setShippingForm] = useState<ShippingForm>(initialForm);

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("betaskincare_cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error("Error al cargar carrito:", e);
      }
    }

    const storedForm = localStorage.getItem("betaskincare_shipping_form");
    if (storedForm) {
      try {
        setShippingForm(JSON.parse(storedForm));
      } catch (e) {
        console.error("Error al cargar datos de envío:", e);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("betaskincare_cart", JSON.stringify(cart));
  }, [cart]);

  // Guardar formulario en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("betaskincare_shipping_form", JSON.stringify(shippingForm));
  }, [shippingForm]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateShippingForm = (form: Partial<ShippingForm>) => {
    setShippingForm(prev => ({ ...prev, ...form }));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = cart.reduce((acc, item) => {
    const price = item.product.price;
    const discount = item.product.discount;
    const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
    return acc + finalPrice * item.quantity;
  }, 0);

  // Obtener costo de envío (S/.10 si es delivery, S/.0 si es pickup)
  const deliveryFee = shippingForm.method === "delivery" ? 10 : 0;

  const total = subtotal + deliveryFee;

  const checkoutWhatsApp = () => {
    if (cart.length === 0) return;

    let targetPhone = "51973468722";
    try {
      const stored = localStorage.getItem("betaskincare_settings");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.whatsappPhone) {
          const clean = String(parsed.whatsappPhone).replace(/\D/g, "");
          if (clean) targetPhone = clean;
        }
      }
    } catch (e) {
      console.error(e);
    }

    const methodLabel = shippingForm.method === "delivery" 
      ? `Delivery (S/. ${deliveryFee.toFixed(2)})` 
      : "Recojo en tienda";

    let message = "🌸 ¡Hola! Quiero hacer un pedido en *BetaSkinCare*:\n\n";
    cart.forEach(item => {
      const price = item.product.price;
      const discount = item.product.discount;
      const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
      message += `▪️ *${item.product.name}* x${item.quantity} = S/. ${(finalPrice * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Subtotal:* S/. ${subtotal.toFixed(2)}`;
    message += `\n*Envío:* ${methodLabel}`;
    message += `\n*Total a pagar:* S/. ${total.toFixed(2)}`;
    message += "\n\n📋 *Mis datos de entrega:*";
    message += `\n👤 *Nombre:* ${shippingForm.name || "(sin especificar)"}`;
    message += `\n📍 *Distrito:* ${shippingForm.district || "(sin especificar)"}`;
    message += `\n🏠 *Dirección:* ${shippingForm.address || "(sin especificar)"}`;
    message += `\n🗺️ *Referencia:* ${shippingForm.reference || "(sin especificar)"}`;
    message += `\n💳 *Medio de pago preferido:* ${shippingForm.payment.toUpperCase()}`;

    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <CartContext.Provider 
      value={{
        cart,
        shippingForm,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        updateShippingForm,
        totalItems,
        subtotal,
        deliveryFee,
        total,
        checkoutWhatsApp
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
