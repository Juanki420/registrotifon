// login.js
import { db } from './firebaseConfig.js';
import { mostrarMenu } from './app.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

export function mostrarLogin() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
        <h2>Acceso restringido</h2>
        <input id="inputPassword" type="password" placeholder="Introduce la contraseña" style="width: 100%; padding: 8px; font-size: 16px;">
        <br><br>
        <button id="btnEntrar">Entrar</button>
        <p id="errorMsg" style="color:red;"></p>
    `;

    document.getElementById("btnEntrar").onclick = async () => {
        const passwordIntroducida = document.getElementById("inputPassword").value;
        if (!passwordIntroducida) {
            mostrarError("La contraseña no puede estar vacía.");
            return;
        }
        try {
            const docRef = doc(db, "config", "login");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const passwordCorrecta = docSnap.data().password;
                if (passwordIntroducida === passwordCorrecta) {
                    // ✅ Guardar token en localStorage
                    localStorage.setItem("usuarioAutenticado", "true");

                    mostrarMenu();
                } else {
                    mostrarError("Contraseña incorrecta.");
                }
            } else {
                mostrarError("No hay configuración de contraseña en Firestore.");
            }
        } catch (error) {
            mostrarError("Error al verificar la contraseña: " + error.message);
        }
    };

    function mostrarError(msg) {
        document.getElementById("errorMsg").textContent = msg;
    }
}
