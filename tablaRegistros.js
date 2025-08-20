// tablaRegistros.js
import { cargarTodosRegistros } from './registroFirebase.js';

let registros = [];
let registrosFiltrados = [];
let paginaActual = 1;
const registrosPorPagina = 30;

export async function mostrarTabla() {
    registros = await cargarTodosRegistros();
    // Ordenar de más reciente a más antiguo
registros.sort((a, b) => {
    const fechaA = new Date(a.FechaObj?.seconds ? a.FechaObj.seconds * 1000 : a.Fecha);
    const fechaB = new Date(b.FechaObj?.seconds ? b.FechaObj.seconds * 1000 : b.Fecha);
    return fechaB - fechaA;
});

    registrosFiltrados = registros.slice();
    paginaActual = 1;

    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
        <h2>Listado de registros</h2>
        <input id="filtroInput" placeholder="Filtrar por Vendedora, Localidad, Producto o Resultado"
            style="width: 100%; padding: 10px; margin-bottom: 5px; position: sticky; top: 0; background: white; z-index: 10; border: 1px solid #ccc;">
        
        <div id="contadorRegistros" style="margin-bottom: 10px; font-size: 14px; color: #555;"></div>

        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #ddd;">
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;" id="tablaRegistros">
                <thead>
                    <tr style="background: #f0f0f0;">
                        <th>Fecha</th>
                        <th>Vendedora</th>
                        <th>Localidad</th>
                        <th>Visita múltiple</th>
                        <th>Producto</th>
                        <th>Resultado</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <br>
        <button id="btnPrev" style="transform: scale(0.65); margin-right: 10px;">⬅ Página anterior</button>
        <button id="btnNext" style="transform: scale(0.65);">Página siguiente ➡</button>

        <!-- Nuevo indicador de página -->
        <div id="infoPagina" style="margin-top: 5px; font-weight: bold; text-align: center;"></div>

        <br><br>
        <button id="btnVolverMenu">Volver al menú principal</button>
    `;

    // Eventos
    document.getElementById("filtroInput").addEventListener("input", e => {
        const texto = e.target.value.toLowerCase();
registrosFiltrados = registros.filter(r =>
    r.Fecha.toLowerCase().includes(texto) || // ahora también busca en la fecha visual
    r.Vendedora.toLowerCase().includes(texto) ||
    (r.Localidad && r.Localidad.toLowerCase().includes(texto)) ||
    r.Producto.toLowerCase().includes(texto) ||
    r.Resultado.toLowerCase().includes(texto)
);

        paginaActual = 1;
        actualizarTabla();
    });

    document.getElementById("btnPrev").onclick = () => {
        if (paginaActual > 1) {
            paginaActual--;
            actualizarTabla();
        }
    };

    document.getElementById("btnNext").onclick = () => {
        if (paginaActual * registrosPorPagina < registrosFiltrados.length) {
            paginaActual++;
            actualizarTabla();
        }
    };

    document.getElementById("btnVolverMenu").onclick = () => {
        import('./app.js').then(m => m.mostrarMenu());
    };

    actualizarTabla();
}

function actualizarTabla() {
    const tbody = document.querySelector("#tablaRegistros tbody");
    tbody.innerHTML = registrosFiltrados
        .slice((paginaActual - 1) * registrosPorPagina, paginaActual * registrosPorPagina)
        .map(r => `<tr>
            <td>${r.Fecha}</td>
            <td>${r.Vendedora}</td>
            <td>${r.Localidad || ""}</td>
            <td>${r["Visita múltiple"]}</td>
            <td>${r.Producto}</td>
            <td>${r.Resultado}</td>
        </tr>`).join("");

    // Actualizar contador
    const contador = document.getElementById("contadorRegistros");
    contador.textContent = `Mostrando ${registrosFiltrados.length} de ${registros.length} registros`;

    // Actualizar info de página
    const totalPaginas = Math.ceil(registrosFiltrados.length / registrosPorPagina);
    document.getElementById("infoPagina").textContent = `Página ${paginaActual} de ${totalPaginas}`;

    // Botones
    document.getElementById("btnPrev").disabled = paginaActual === 1;
    document.getElementById("btnNext").disabled = paginaActual >= totalPaginas;
}