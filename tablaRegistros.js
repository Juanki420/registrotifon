// tablaRegistros.js
import { cargarTodosRegistros, actualizarRegistro } from './registroFirebase.js';

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

        <div style="border: 1px solid #ddd;">
            <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;" id="tablaRegistros">
                <thead>
                    <tr style="background: #f0f0f0;">
                        <th>Fecha</th>
                        <th>Vendedora</th>
                        <th>Localidad</th>
                        <th>Visita múltiple</th>
                        <th>Producto</th>
                        <th>Resultado</th>
                        <th>Acciones</th>
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
    const inicio = (paginaActual - 1) * registrosPorPagina;
    tbody.innerHTML = registrosFiltrados
        .slice(inicio, inicio + registrosPorPagina)
        .map((r, i) => `<tr>
            <td>${r.Fecha}</td>
            <td>${r.Vendedora}</td>
            <td>${r.Localidad || ""}</td>
            <td>${r["Visita múltiple"]}</td>
            <td>${r.Producto}</td>
            <td>${r.Resultado}</td>
            <td><button class="editar-btn" data-index="${inicio + i}">Editar</button></td>
        </tr>`).join("");

    document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const registro = registrosFiltrados[btn.dataset.index];
            editarRegistro(registro);
        });
    });

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

function toInputDate(registro) {
    const d = new Date(registro.FechaObj?.seconds ? registro.FechaObj.seconds * 1000 : registro.FechaObj);
    return d.toISOString().split('T')[0];
}

function editarRegistro(registro) {
    const appDiv = document.getElementById("app");
    appDiv.innerHTML = `
        <h2>Editar registro</h2>
        <label>Fecha: <input type="date" id="editFecha" value="${toInputDate(registro)}"></label><br><br>
        <label>Vendedora: <input type="text" id="editVendedora" value="${registro.Vendedora}"></label><br><br>
        <label>Localidad: <input type="text" id="editLocalidad" value="${registro.Localidad || ''}"></label><br><br>
        <label>Visita múltiple:
            <select id="editVisita">
                <option value="Sí"${registro["Visita múltiple"] === "Sí" ? ' selected' : ''}>Sí</option>
                <option value="No"${registro["Visita múltiple"] === "No" ? ' selected' : ''}>No</option>
            </select>
        </label><br><br>
        <label>Producto: <input type="text" id="editProducto" value="${registro.Producto}"></label><br><br>
        <label>Resultado: <input type="text" id="editResultado" value="${registro.Resultado}"></label><br><br>
        <button id="btnGuardarEdit">Guardar</button>
        <button id="btnCancelarEdit">Cancelar</button>
    `;

    document.getElementById('btnGuardarEdit').onclick = async () => {
        const nuevaFecha = new Date(document.getElementById('editFecha').value);
        const datosActualizados = {
            FechaObj: nuevaFecha,
            Vendedora: document.getElementById('editVendedora').value,
            Localidad: document.getElementById('editLocalidad').value,
            "Visita múltiple": document.getElementById('editVisita').value,
            Producto: document.getElementById('editProducto').value,
            Resultado: document.getElementById('editResultado').value
        };
        const ok = await actualizarRegistro(registro.fechaDoc, registro.id, datosActualizados);
        if (ok) mostrarTabla();
    };

    document.getElementById('btnCancelarEdit').onclick = () => mostrarTabla();
}