// registro.js
import { crearBotones } from './utils.js';
import { guardarRegistro } from './registroFirebase.js';

let registroActual = {};
let historialPasos = [];

export function iniciarRegistro() {
    historialPasos = [];
    pasoVendedora();
}

function pasoVendedora() {
    const fechaObj = new Date();
    registroActual = { FechaObj: fechaObj.toISOString() };
    crearBotones("Selecciona la vendedora:", ["Isa", "Caty", "Maria Dolores", "Mari Huertas", "Diana", "Marisol","Sin Vendedora"], pasoLocalidad, mostrarMenu, historialPasos);
}

function pasoLocalidad(vendedora) {
    registroActual["Vendedora"] = vendedora;
    historialPasos.push(pasoVendedora);
    document.getElementById("app").innerHTML = `
        <h2>Introduce la localidad:</h2>
        <input id="inputLocalidad" type="text" placeholder="Escribe la localidad">
        <br><br>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="btnSaltar" style="background-color: red; color: white; padding: 10px 15px;">Saltar</button>
            <button id="btnSiguiente" style="background-color: #007BFF; color: white; padding: 10px 15px;">Siguiente</button>
        </div>
        <br><br>
        <button id="btnAtras">⬅ Atrás</button>
    `;
    document.getElementById("btnSiguiente").onclick = () => {
        const loc = document.getElementById("inputLocalidad").value.trim();
        if (!loc) {
            alert("Por favor, escribe una localidad o pulsa 'Saltar'.");
            return;
        }
        registroActual["Localidad"] = loc;
        pasoVisitaMultiple();
    };
    document.getElementById("btnSaltar").onclick = () => {
        pasoVisitaMultiple();
    };
    document.getElementById("btnAtras").onclick = () => {
        if(historialPasos.length) {
            const paso = historialPasos.pop();
            paso();
        }
    };
}

function pasoVisitaMultiple() {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
        <h2>¿Ha venido más de una vez?</h2>
        <div id="botonesVisitaMultiple" style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;"></div>
        <br>
        <button id="btnAtras">⬅ Atrás</button>
    `;

    const contenedorBotones = document.getElementById("botonesVisitaMultiple");
    ["Sí", "No"].forEach(opcion => {
        const boton = document.createElement("button");
        boton.textContent = opcion;
        boton.style.minWidth = "100px"; // opcional para tamaño uniforme
        boton.onclick = () => pasoProducto(opcion);
        contenedorBotones.appendChild(boton);
    });

    document.getElementById("btnAtras").onclick = () => {
        if(historialPasos.length) {
            const paso = historialPasos.pop();
            paso();
        }
    };
}


function pasoLocalidadBack() {
    pasoLocalidad(registroActual["Vendedora"]);
}

function pasoProducto(visitaMultiple) {
    registroActual["Visita múltiple"] = visitaMultiple;
    document.getElementById("app").innerHTML = `
    <h2>Lo que viene buscando:</h2>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-width: 400px; margin: auto; text-align: left;">
    ${["Salón","Dormitorio","Juvenil","Sofá","Sillón","Decoración","Auxiliar","Otro"].map(p => `
    <label class="checkbox-label" style="display:flex; align-items:center; margin-bottom:20px;">
        <input type="checkbox" value="${p}"> ${p}
    </label>
    `).join("")}

    </div>
    <div id="otroProductoContainer" style="display:none; margin-top:20px;">
        <input id="productoOtro" type="text" placeholder="Especifica el producto">
    </div>
    <br>
    <button id="btnSiguiente">Siguiente</button>
    <br><br>
    <button id="btnAtras">⬅ Atrás</button>
`;


    const checkboxes = document.querySelectorAll('input[type=checkbox]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', e => {
            const otro = Array.from(checkboxes).find(c => c.value === "Otro");
            if (otro.checked) {
                document.getElementById("otroProductoContainer").style.display = "block";
            } else {
                document.getElementById("otroProductoContainer").style.display = "none";
                document.getElementById("productoOtro").value = "";
            }
        });
    });

    document.getElementById("btnSiguiente").onclick = () => {
        const seleccionados = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
        if (seleccionados.includes("Otro")) {
            const otroValor = document.getElementById("productoOtro").value.trim();
            if (otroValor) {
                seleccionados[seleccionados.indexOf("Otro")] = otroValor;
            } else {
                alert("Por favor, especifica el producto en 'Otro' o desmarca la opción.");
                return;
            }
        }
        if(seleccionados.length === 0){
            alert("Por favor, selecciona al menos un producto.");
            return;
        }
        registroActual["Producto"] = seleccionados.join(", ");
        pasoResultado();
    };
    document.getElementById("btnAtras").onclick = () => pasoVisitaMultiple();
}

function pasoResultado() {
    crearBotones("Resultado de la visita:", ["Comprado", "Presupuesto", "Sin interés"], confirmarGuardar, pasoProductoBack, historialPasos);
}

function pasoProductoBack() {
    pasoProducto(registroActual["Visita múltiple"]);
}

async function confirmarGuardar(resultado) {
    registroActual["Resultado"] = resultado;
    document.getElementById("app").innerHTML = `
        <h2>Confirma los datos:</h2>
        <pre style="font-size: 18px; text-align: left; max-width: 600px; margin: auto; background:#eee; padding:15px; border-radius: 8px;">
Fecha: ${formatearFechaVisual(registroActual.FechaObj)}
Vendedora: ${registroActual.Vendedora}
Localidad: ${registroActual.Localidad || ""}
Visita múltiple: ${registroActual["Visita múltiple"]}
Producto: ${registroActual.Producto}
Resultado: ${registroActual.Resultado}
        </pre>
        <button id="btnGuardar">Guardar</button>
        <button id="btnCancelar">Cancelar</button>
    `;
    document.getElementById("btnGuardar").onclick = async () => {
        const ok = await guardarRegistro(registroActual);
        if(ok) mostrarMenu();
    };
    document.getElementById("btnCancelar").onclick = () => mostrarMenu();
}

import { mostrarMenu } from './app.js';
import { formatearFechaVisual } from './utils.js';
