// registroFirebase.js
import { db } from './firebaseConfig.js';
import { doc, collection, setDoc, addDoc, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

function formatearFechaId(fecha) {
    const d = new Date(fecha);
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const año = d.getFullYear();
    return `${dia}-${mes}-${año}`;
}

function formatearFechaVisual(fecha) {
    const d = new Date(fecha);
    const dia = d.getDate().toString().padStart(2, '0');
    const mes = (d.getMonth() + 1).toString().padStart(2, '0');
    const año = d.getFullYear();
    return `${dia}/${mes}/${año}`;
}

export async function guardarRegistro(registroActual) {
    try {
        const fechaId = formatearFechaId(registroActual.FechaObj);
        const fechaVisual = formatearFechaVisual(registroActual.FechaObj);
        const fechaObj = new Date(registroActual.FechaObj);

        const registroOrdenado = {
            Fecha: fechaVisual,
            Vendedora: registroActual.Vendedora,
            Localidad: registroActual.Localidad || "",
            "Visita múltiple": registroActual["Visita múltiple"],
            Producto: registroActual.Producto,
            Resultado: registroActual.Resultado,
            FechaObj: Timestamp.fromDate(fechaObj)
        };

        // Guardar doc base con la fecha (solo fecha para índice)
        await setDoc(doc(db, "visitas", fechaId), { fecha: fechaVisual }, { merge: true });

        // Añadir subcolección con registro
        await addDoc(collection(db, "visitas", fechaId, fechaId), registroOrdenado);

        alert("Registro guardado correctamente.");
        return true;
    } catch (error) {
        alert("Error guardando registro: " + error.message);
        return false;
    }
}

export async function cargarTodosRegistros() {
    const registros = [];
    try {
        const visitasCol = collection(db, "visitas");
        const visitasSnapshot = await getDocs(visitasCol);

        const promesas = [];

        visitasSnapshot.forEach(docVisita => {
            const fechaDoc = docVisita.id;
            const subColRef = collection(db, "visitas", fechaDoc, fechaDoc);
            promesas.push(
                getDocs(subColRef).then(subColSnap => {
                    subColSnap.forEach(subDoc => {
                        registros.push(subDoc.data());
                    });
                })
            );
        });

        await Promise.all(promesas);
        return registros;
    } catch (error) {
        alert("Error al cargar registros: " + error.message);
        return [];
    }
}
