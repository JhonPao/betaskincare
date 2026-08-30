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
  logoUrl?: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: "sunscreen", name: "sunscreen", label: "Sun Care", type: "category" },
  { id: "makeup", name: "makeup", label: "Maquillaje", type: "category" },
  { id: "mini", name: "mini", label: "Minis", type: "category" },
  { id: "cosrx", name: "cosrx", label: "COSRX", type: "brand" },
  { id: "beauty-of-joseon", name: "beauty-of-joseon", label: "Beauty of Joseon", type: "brand" },
  { id: "anua", name: "anua", label: "Anua", type: "brand" },
  { id: "skin1004", name: "skin1004", label: "SKIN1004", type: "brand" },
  { id: "round-lab", name: "round-lab", label: "Round Lab", type: "brand" },
  { id: "laneige", name: "laneige", label: "Laneige", type: "brand" }
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

// 4. Subir imagen a Firebase Storage (con fallback seguro a DataURL en caso de fallar reglas de Storage)
export async function uploadProductImage(file: File, productId: string | number): Promise<string> {
  try {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `products/${productId}/${timestamp}_${safeName}`;
    const storageRef = ref(storage, path);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.warn("Storage upload warn, convirtiendo a DataURL de respaldo:", error);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
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
    await setDoc(refDoc, category);
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
