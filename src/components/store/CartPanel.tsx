"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Plus, Minus, Trash2, Send } from "lucide-react";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const { 
    cart, 
    shippingForm, 
    updateQuantity, 
    removeFromCart, 
    updateShippingForm,
    subtotal, 
    deliveryFee, 
    total, 
    checkoutWhatsApp 
  } = useCart();

  const handleQtyChange = (productId: number, currentQty: number, change: number, stock: number) => {
    const newQty = currentQty + change;
    if (newQty <= stock && newQty >= 0) {
      updateQuantity(productId, newQty);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md bg-white border-l border-brand-primary-dark/15 flex flex-col h-full p-0">
        <SheetHeader className="p-6 border-b border-brand-primary-dark/10">
          <SheetTitle className="flex items-center gap-2 font-serif text-lg font-bold">
            <ShoppingBag className="w-5 h-5 text-brand-primary-dark" />
            Tu Carrito de Compras
          </SheetTitle>
          <SheetDescription className="hidden">
            Revisa los artículos de tu carrito y completa los datos de entrega.
          </SheetDescription>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-brand-primary-light rounded-full flex items-center justify-center text-brand-primary-dark mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-base font-semibold mb-1">Tu carrito está vacío</h3>
            <p className="text-sm text-brand-text-muted max-w-[240px] mb-6">
              Explora nuestro catálogo y añade tus productos K-Beauty favoritos.
            </p>
            <Button onClick={onClose} className="rounded-full bg-linear-to-r from-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-primary text-white cursor-pointer shadow-xs">
              Volver a la tienda
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.map((item) => {
                const finalPrice = item.product.discount > 0 
                  ? item.product.price * (1 - item.product.discount / 100) 
                  : item.product.price;
                
                return (
                  <div key={item.product.id} className="flex gap-4 p-3 bg-stone-50 border border-brand-primary-dark/5 rounded-2xl">
                    {/* Imagen */}
                    <div className="w-16 h-16 bg-white border border-brand-primary-dark/10 rounded-xl flex items-center justify-center p-2 shrink-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    {/* Detalles */}
                    <div className="flex-1 flex flex-col min-w-0">
                      <h4 className="font-medium text-sm text-foreground leading-tight truncate mb-1">
                        {item.product.name}
                      </h4>
                      <span className="text-[10px] text-brand-primary-dark font-semibold uppercase tracking-wider mb-2">
                        {item.product.categoryLabel}
                      </span>
                      {/* Controles de cantidad y precio */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center border border-stone-200 rounded-full bg-white px-1">
                          <button 
                            onClick={() => handleQtyChange(item.product.id, item.quantity, -1, item.product.stock)}
                            className="p-1 text-stone-500 hover:text-foreground cursor-pointer disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                          <button 
                            onClick={() => handleQtyChange(item.product.id, item.quantity, 1, item.product.stock)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 text-stone-500 hover:text-foreground cursor-pointer disabled:opacity-30"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs text-brand-text-muted">S/.</span>
                          <span className="font-bold text-sm">{(finalPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    {/* Eliminar */}
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-300 hover:text-red-500 cursor-pointer self-start p-1"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Formulario de envío y Totales */}
            <div className="border-t border-brand-primary-dark/15 bg-stone-50/50 p-6 space-y-4">
              <h3 className="font-serif text-sm font-semibold border-b border-brand-primary-dark/10 pb-2 mb-1">
                Datos de Envío y Pago
              </h3>
              
              {/* Selector de Método de Entrega */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateShippingForm({ method: "delivery" })}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    shippingForm.method === "delivery"
                      ? "bg-linear-to-r from-primary to-brand-primary-dark text-white border-transparent shadow-xs"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                   Envío a Domicilio
                </button>
                <button
                  type="button"
                  onClick={() => updateShippingForm({ method: "pickup" })}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    shippingForm.method === "pickup"
                      ? "bg-linear-to-r from-primary to-brand-primary-dark text-white border-transparent shadow-xs"
                      : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
                >
                   Recojo en Tienda
                </button>
              </div>

              {/* Campos dinámicos del formulario */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                    Nombre del Cliente
                  </label>
                  <Input 
                    type="text" 
                    value={shippingForm.name} 
                    onChange={(e) => updateShippingForm({ name: e.target.value })}
                    placeholder="Ej. Ana García"
                    className="bg-white border-stone-200 text-sm py-1.5 focus:border-brand-primary-dark focus:ring-brand-primary-dark"
                  />
                </div>

                {shippingForm.method === "delivery" && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                          Distrito
                        </label>
                        <Input 
                          type="text" 
                          value={shippingForm.district} 
                          onChange={(e) => updateShippingForm({ district: e.target.value })}
                          placeholder="Ej. Miraflores"
                          className="bg-white border-stone-200 text-sm py-1.5"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                          Referencia
                        </label>
                        <Input 
                          type="text" 
                          value={shippingForm.reference} 
                          onChange={(e) => updateShippingForm({ reference: e.target.value })}
                          placeholder="Ej. Frente al parque"
                          className="bg-white border-stone-200 text-sm py-1.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                        Dirección Completa
                      </label>
                      <Input 
                        type="text" 
                        value={shippingForm.address} 
                        onChange={(e) => updateShippingForm({ address: e.target.value })}
                        placeholder="Ej. Av. Larco 123 Dpto 401"
                        className="bg-white border-stone-200 text-sm py-1.5"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                    Método de Pago
                  </label>
                  <select 
                    value={shippingForm.payment}
                    onChange={(e) => updateShippingForm({ payment: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-lg text-sm p-2 outline-none focus:border-brand-primary-dark focus:ring-1 focus:ring-brand-primary-dark"
                  >
                    <option value="yape">Yape</option>
                    <option value="plin">Plin</option>
                    <option value="transferencia">Transferencia Bancaria (BCP/BBVA)</option>
                    <option value="efectivo">Efectivo contra entrega (Solo Cajamarca)</option>
                  </select>
                </div>
              </div>

              {/* Resumen de costos */}
              <div className="space-y-1.5 text-sm pt-2 border-t border-brand-primary-dark/10">
                <div className="flex justify-between text-stone-600 text-xs">
                  <span>Subtotal:</span>
                  <span>S/. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600 text-xs">
                  <span>Costo de Envío:</span>
                  <span>{deliveryFee === 0 ? "Gratis" : `S/. ${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-foreground pt-1.5 border-t border-dashed border-stone-200">
                  <span>Total:</span>
                  <span className="text-brand-primary-dark">S/. {total.toFixed(2)}</span>
                </div>
              </div>

              {/* Botón de Checkout */}
              <Button
                onClick={checkoutWhatsApp}
                disabled={!shippingForm.name.trim()}
                className="w-full py-6 rounded-full bg-linear-to-r from-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-primary text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Pedir por WhatsApp
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
