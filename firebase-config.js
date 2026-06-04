// ═══════════════════════════════════════════════
// CONFIGURACIÓN DE FIREBASE
// ═══════════════════════════════════════════════
// 1. Ve a https://console.firebase.google.com
// 2. Crea un proyecto (o usa uno existente)
// 3. Activa Firestore Database → "Crear base de datos" → modo prueba
// 4. Activa Authentication → "Sign-in method" → "Correo electrónico/contraseña"
// 5. En "Configuración del proyecto" → "Tus aplicaciones" → "Web" → copia la config
// 6. Reemplaza los valores abajo con los de tu proyecto
// ═══════════════════════════════════════════════

const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencias globales (usadas por firebase-db.js y los HTML)
const db = firebase.firestore();
const auth = firebase.auth();
const PRODUCTS_COLLECTION = 'products';
