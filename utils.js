// utils.js
export function formatearFechaId(fecha) {
    const d = new Date(fecha);
    let dia = d.getDate();
    let mes = d.getMonth() + 1;
    let año = d.getFullYear();
    return `${dia}-${mes}-${año}`;
}

export function formatearFechaVisual(fecha) {
    const d = new Date(fecha);
    let dia = d.getDate();
    let mes = d.getMonth() + 1;
    let año = d.getFullYear();
    return `${dia}/${mes}/${año}`;
}

// utils.js
export function crearBotones(titulo, opciones, siguientePaso, pasoAnterior = null, historialPasos) {
    if (pasoAnterior) historialPasos.push(pasoAnterior);
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
        <h2>${titulo}</h2>
        <div class="button-grid" id="botonesContainer"></div>
        ${pasoAnterior ? `<br><button id="btnAtras" class="btn-pequeno">⬅ Atrás</button>` : ""}
    `;
    const contenedor = document.getElementById("botonesContainer");
    opciones.forEach(op => {
        const boton = document.createElement("button");
        boton.textContent = op;
        boton.classList.add("btn-pequeno");
        boton.addEventListener("click", () => {
            siguientePaso(op);
        });
        contenedor.appendChild(boton);
    });
    if (pasoAnterior) {
        document.getElementById("btnAtras").addEventListener("click", () => {
            if(historialPasos.length > 0) {
                const paso = historialPasos.pop();
                paso();
            }
        });
    }
}