import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbEF9b8vvhI8UHJ_buwbUBEG1dYxQWVnc",
  authDomain: "bdbsc-8bcc7.firebaseapp.com",
  projectId: "bdbsc-8bcc7",
  storageBucket: "bdbsc-8bcc7.firebasestorage.app",
  messagingSenderId: "821198851805",
  appId: "1:821198851805:web:9d6f1f15bb8a31c9ef1534",
  measurementId: "G-PKQ12BMBTN"
};

// Inicializar Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

const PRODUCTS_COLLECTION = "products";
const CATEGORIES_COLLECTION = "categories";

export { db, auth, storage };

// ──────── INTERFACES DE DATOS ────────
export interface Product {
  id: number;
  name: string;
  category: string;
  categoryLabel: string;
  brand?: string;
  price: number;
  discount: number;
  stock: number;
  delivery: "inmediata" | "distribuidor";
  shippingTime: string;
  image: string;
  images?: string[]; // Lista de fotos secundarias para carrusel
  badge: string | null;
  rating: number;
  reviewCount: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  label: string;
  type: "category" | "brand";
  tagline?: string;
  badge?: string;
  image?: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "sunscreen", name: "sunscreen", label: "Sun Care", type: "category" },
  { id: "makeup", name: "makeup", label: "Maquillaje", type: "category" },
  { id: "mini", name: "mini", label: "Minis", type: "category" },
  { 
    id: "cosrx", 
    name: "cosrx", 
    label: "COSRX", 
    type: "brand",
    tagline: "Fórmulas minimalistas de alta efectividad con mucina de caracol y BHA",
    badge: "Top Ventas K-Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop"
  },
  { 
    id: "beauty-of-joseon", 
    name: "beauty-of-joseon", 
    label: "Beauty of Joseon", 
    type: "brand",
    tagline: "Medicina tradicional coreana (Hanbang) infusionada con ciencia moderna",
    badge: "Viral Mundial",
    image: "https://images.unsplash.com/photo-1608248597263-0057e05b4b74?w=400&h=300&fit=crop"
  },
  { 
    id: "anua", 
    name: "anua", 
    label: "Anua", 
    type: "brand",
    tagline: "Especialistas en calmar pieles sensibles y propensas al acné con Heartleaf",
    badge: "Piel Radiante",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=300&fit=crop"
  },
  { 
    id: "skin1004", 
    name: "skin1004", 
    label: "SKIN1004", 
    type: "brand",
    tagline: "Centella Asiática pura de Madagascar para restaurar y calmar tu rostro",
    badge: "100% Botánico",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop"
  },
  { 
    id: "round-lab", 
    name: "round-lab", 
    label: "Round Lab", 
    type: "brand",
    tagline: "Hidratación profunda con agua de las profundidades de la Isla Dokdo",
    badge: "Nº1 en Corea",
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&h=300&fit=crop"
  },
  { 
    id: "laneige", 
    name: "laneige", 
    label: "Laneige", 
    type: "brand",
    tagline: "Expertos en barrera de humedad y mascarillas labiales icónicas",
    badge: "Lujo Accesible",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=300&fit=crop"
  }
];

export const CATEGORY_LABELS: Record<string, string> = {
  sunscreen: "Sun Care",
  makeup: "Maquillaje",
  mini: "Minis"
};

// ──────── OPERACIONES CRUD DE PRODUCTOS ────────

// 1. Obtener todos los productos ordenados por ID
export async function getProductsFromFirebase(): Promise<Product[]> {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("id", "asc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const mainImage = data.image || "";
      const rawImages = Array.isArray(data.images) && data.images.length > 0 ? data.images : [mainImage].filter(Boolean);

      return {
        id: data.id,
        name: data.name || "",
        category: data.category || "sunscreen",
        categoryLabel: data.categoryLabel || CATEGORY_LABELS[data.category] || data.category || "Sun Care",
        brand: data.brand || "",
        price: Number(data.price) || 0,
        discount: Number(data.discount) || 0,
        stock: Number(data.stock) || 0,
        delivery: data.delivery || "inmediata",
        shippingTime: data.shippingTime || "",
        image: mainImage,
        images: rawImages,
        badge: data.badge || null,
        rating: Number(data.rating) || 5,
        reviewCount: Number(data.reviewCount) || 1
      } as Product;
    });
  } catch (error) {
    console.error("Error al leer productos de Firestore:", error);
    throw error;
  }
}

// 2. Guardar o actualizar un producto
export async function saveProductToFirebase(product: Product): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, String(product.id));
    // Eliminar campos undefined para evitar error de Firestore "Unsupported field value: undefined"
    const cleanProduct = JSON.parse(JSON.stringify(product, (key, value) => value === undefined ? "" : value));
    await setDoc(productRef, cleanProduct);
  } catch (error) {
    console.error("Error al escribir producto en Firestore:", error);
    throw error;
  }
}

// 3. Eliminar un producto
export async function deleteProductFromFirebase(productId: number): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, String(productId));
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error al eliminar producto de Firestore:", error);
    throw error;
  }
}

// ──────── OPERACIONES CRUD DE CATEGORÍAS Y MARCAS ────────

export async function getCategoriesFromFirebase(): Promise<CategoryItem[]> {
  try {
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (snapshot.empty) return DEFAULT_CATEGORIES;
    return snapshot.docs.map(doc => doc.data() as CategoryItem);
  } catch (error) {
    console.warn("Firestore categories error, usando por defecto:", error);
    const cached = localStorage.getItem("betaskincare_categories");
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategoryToFirebase(category: CategoryItem): Promise<void> {
  try {
    const refDoc = doc(db, CATEGORIES_COLLECTION, category.id);
    const cleanCat = JSON.parse(JSON.stringify(category, (key, value) => value === undefined ? "" : value));
    await setDoc(refDoc, cleanCat);
  } catch (error) {
    console.warn("Save category Firestore error:", error);
  }
}

export async function deleteCategoryFromFirebase(categoryId: string): Promise<void> {
  try {
    const refDoc = doc(db, CATEGORIES_COLLECTION, categoryId);
    await deleteDoc(refDoc);
  } catch (error) {
    console.warn("Delete category Firestore error:", error);
  }
}
