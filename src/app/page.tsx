"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/store/Navbar";
import { Hero } from "@/components/store/Hero";
import { ProductGrid } from "@/components/store/ProductGrid";
import { BrandsSection } from "@/components/store/BrandsSection";
import { About } from "@/components/store/About";
import { Footer } from "@/components/store/Footer";
import { CartPanel } from "@/components/store/CartPanel";
import { ProductDetailsModal } from "@/components/store/ProductDetailsModal";
import { Product } from "@/lib/firebase";

export default function StorefrontPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string | null>(null);

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedProduct(null);
    setIsDetailsOpen(false);
  };

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrandFilter(brandId);
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navegación */}
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      {/* Secciones */}
      <main className="flex-1">
        {/* Banner principal */}
        <Hero />

        {/* Catálogo de Productos */}
        <ProductGrid 
          onOpenDetails={handleOpenDetails} 
          selectedBrandFilter={selectedBrandFilter}
        />

        {/* Zona de Marcas */}
        <BrandsSection onSelectBrand={handleSelectBrand} />

        {/* Quiénes somos */}
        <About />
      </main>

      {/* Pie de página */}
      <Footer />

      {/* Panel del Carrito lateral */}
      <CartPanel 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* Modal de Detalle de Producto */}
      <ProductDetailsModal 
        product={selectedProduct} 
        isOpen={isDetailsOpen} 
        onClose={handleCloseDetails} 
      />
    </div>
  );
}
