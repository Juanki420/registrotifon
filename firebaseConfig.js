// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQktG2rLa101GPhQ_nDThdn8TLVX6e0eU",
    authDomain: "registro-de-visitas-cb96f.firebaseapp.com",
    projectId: "registro-de-visitas-cb96f",
    storageBucket: "registro-de-visitas-cb96f.firebasestorage.app",
    messagingSenderId: "996870360641",
    appId: "1:996870360641:web:361ee827b513cf6898c0c0"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
