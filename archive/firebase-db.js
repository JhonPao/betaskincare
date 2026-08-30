// ═══════════════════════════════════════════════
// FIRESTORE CRUD — Productos
// ═══════════════════════════════════════════════
// Depende de: firebase-config.js (debe cargarse antes)
// Uso: sincronización entre localStorage y Firestore
// ═══════════════════════════════════════════════

// ──────── Leer productos desde Firestore ────────
// Busca en la colección, ordena por id, actualiza localStorage.
async function syncProductsFromFirebase() {
  if (typeof db === 'undefined') return false;
  try {
    const snapshot = await db.collection(PRODUCTS_COLLECTION).orderBy('id', 'asc').get();
    if (snapshot.empty) return false;
    const products = snapshot.docs.map(doc => doc.data());
    localStorage.setItem('betaskincare_products', JSON.stringify(products));
    return true;
  } catch (e) {
    console.warn('Firebase sync error (lectura):', e.message);
    return false;
  }
}

// ──────── Escribir un producto en Firestore ────────
// Usa el campo `id` del producto como ID del documento.
async function saveProductToFirebase(product) {
  if (typeof db === 'undefined') return;
  try {
    await db.collection(PRODUCTS_COLLECTION).doc(String(product.id)).set(product);
  } catch (e) {
    console.warn('Firebase sync error (escritura):', e.message);
  }
}

// ──────── Eliminar un producto de Firestore ────────
async function deleteProductFromFirebase(productId) {
  if (typeof db === 'undefined') return;
  try {
    await db.collection(PRODUCTS_COLLECTION).doc(String(productId)).delete();
  } catch (e) {
    console.warn('Firebase sync error (eliminación):', e.message);
  }
}

// ──────── Sincronizar todos los productos ────────
// Envía todo el array a Firestore usando un batch.
async function syncAllToFirebase(products) {
  if (typeof db === 'undefined' || !products.length) return;
  try {
    const batch = db.batch();
    products.forEach(p => {
      const ref = db.collection(PRODUCTS_COLLECTION).doc(String(p.id));
      batch.set(ref, p);
    });
    await batch.commit();
  } catch (e) {
    console.warn('Firebase batch sync error:', e.message);
  }
}

// ──────── Subir imagen a Firebase Storage ────────
// Guarda en: products/{productId}/{timestamp}_{filename}
// Retorna: URL de descarga pública.
async function uploadProductImage(file, productId) {
  if (typeof storage === 'undefined') {
    throw new Error('Firebase Storage no está disponible');
  }
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `products/${productId}/${timestamp}_${safeName}`;
  const ref = storage.ref(path);
  const snapshot = await ref.put(file);
  return await snapshot.ref.getDownloadURL();
}
