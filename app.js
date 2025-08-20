// app.js
import { iniciarRegistro } from './registro.js';
import { mostrarTabla } from './tablaRegistros.js';
import { mostrarLogin } from './login.js';

export function mostrarMenu() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
        <div style="text-align:center; margin-bottom: 15px;">
            <img src="./logo_galery.png" alt="Logo Empresa" style="max-width: 350px; height: auto;">
        </div>
        <h1>Gestión de Visitas</h1>
        <button id="btnNuevo">Nuevo Registro</button>
        <button id="btnVerTabla">Ver Registros</button>
    `;

    document.getElementById("btnNuevo").onclick = () => iniciarRegistro();
    document.getElementById("btnVerTabla").onclick = () => mostrarTabla();
    document.getElementById("btnCerrarSesion").onclick = () => {
        localStorage.removeItem("usuarioAutenticado");
        location.reload();
    };
}

window.onload = () => {
    const usuarioAutenticado = localStorage.getItem("usuarioAutenticado");
    if (usuarioAutenticado === "true") {
        mostrarMenu();
    } else {
        mostrarLogin();
    }
};
