"use client";

import React, { useState, useEffect } from "react";
import { Product, CategoryItem, getProductsFromFirebase, getCategoriesFromFirebase, DEFAULT_CATEGORIES } from "@/lib/firebase";
import { ProductCard } from "./ProductCard";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGridProps {
  onOpenDetails: (product: Product) => void;
  selectedBrandFilter?: string | null;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ onOpenDetails, selectedBrandFilter }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Cargar categorías y productos de Firebase
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const cachedProducts = localStorage.getItem("betaskincare_products");
        if (cachedProducts) {
          try {
            const parsed = JSON.parse(cachedProducts);
            setProducts(parsed);
            setFilteredProducts(parsed);
          } catch {}
        }

        const [dataProducts, dataCategories] = await Promise.all([
          getProductsFromFirebase(),
          getCategoriesFromFirebase()
        ]);

        if (dataProducts.length > 0) {
          setProducts(dataProducts);
          setFilteredProducts(dataProducts);
          localStorage.setItem("betaskincare_products", JSON.stringify(dataProducts));
        }

        if (dataCategories.length > 0) {
          setCategoriesList(dataCategories);
          localStorage.setItem("betaskincare_categories", JSON.stringify(dataCategories));
        }
      } catch (error) {
        console.error("Error cargando catálogo:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Si se selecciona una marca externamente (por ejemplo desde BrandsSection)
  useEffect(() => {
    if (selectedBrandFilter) {
      setActiveCategory(selectedBrandFilter);
    }
  }, [selectedBrandFilter]);

  // Filtrar productos
  useEffect(() => {
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter(
        p => p.category === activeCategory || p.brand?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        p => 
          p.name.toLowerCase().includes(query) || 
          (p.categoryLabel && p.categoryLabel.toLowerCase().includes(query)) ||
          (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(result);
  }, [activeCategory, searchQuery, products]);

  // Botones de filtro dinámicos (Categorías principales)
  const categoryFilters = [
    { id: "all", label: "Todos" },
    ...categoriesList.filter(c => c.type === "category").map(c => ({ id: c.name, label: c.label }))
  ];

  return (
    <section id="products" className="py-24 px-6 bg-brand-bg relative scroll-mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-brand-primary-dark mb-3 inline-block">
            Nuestros Productos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Belleza Coreana Exclusiva
          </h2>
          <p className="text-sm text-brand-text-light leading-relaxed">
            Fórmulas originales importadas para brindar la hidratación, protección y luminosidad que tu rostro merece.
          </p>
        </div>

        {/* Buscador */}
        <div className="max-w-md mx-auto mb-10 px-4">
          <div className="relative flex items-center bg-white border border-brand-primary-dark/15 rounded-full px-4 py-1 hover:border-brand-primary-dark/30 focus-within:border-brand-primary-dark/60 focus-within:ring-3 focus-within:ring-brand-primary-dark/10 transition-all shadow-sm">
            <Search className="w-5 h-5 text-brand-text-muted mr-3 shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, categoría o marca (COSRX, Anua...)" 
              className="w-full bg-transparent border-none outline-none py-2 text-sm text-foreground placeholder-brand-text-muted"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-xs text-brand-text-light hover:text-brand-primary-dark font-semibold px-2 cursor-pointer"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Categorías Dinámicas */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap px-4">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-linear-to-r from-primary to-brand-primary-dark text-white border-transparent shadow-md"
                  : "bg-white border-brand-primary-dark/15 text-brand-text-light hover:border-brand-primary-dark/40 hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary-dark mb-4"></div>
            <p className="text-sm text-brand-text-light">Cargando catálogo K-Beauty...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-3xl border border-brand-primary-dark/10 shadow-sm max-w-lg mx-auto">
            <span className="text-4xl mb-4 block">🌸</span>
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">No se encontraron productos</h3>
            <p className="text-sm text-brand-text-light max-w-xs mx-auto mb-6">
              Prueba buscando otro término o seleccionando una categoría diferente.
            </p>
            {(searchQuery || activeCategory !== "all") && (
              <Button 
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="rounded-full bg-linear-to-r from-primary to-brand-primary-dark text-white cursor-pointer shadow-xs"
              >
                Ver todos los productos
              </Button>
            )}
          </div>
        ) : (
          /* Grid de Productos */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onOpenDetails={onOpenDetails} 
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
