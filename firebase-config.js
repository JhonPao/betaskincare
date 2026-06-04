// ═══════════════════════════════════════════════
// CONFIGURACIÓN DE FIREBASE
// ═══════════════════════════════════════════════

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
firebase.initializeApp(firebaseConfig);

// Referencias globales (usadas por firebase-db.js y los HTML)
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const PRODUCTS_COLLECTION = 'products';