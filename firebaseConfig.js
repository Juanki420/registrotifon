// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyApNKsmMJzfsWXQpNAEnlD8wel9RJUW7F4",
  authDomain: "registro-tifon.firebaseapp.com",
  projectId: "registro-tifon",
  storageBucket: "registro-tifon.firebasestorage.app",
  messagingSenderId: "186207482498",
  appId: "1:186207482498:web:2eb3e0771f3338ffbcfa9b"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
