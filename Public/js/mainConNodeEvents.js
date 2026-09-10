import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

// ==========================================
// 1. INICIALIZACIÓN
// ==========================================

const repositorio = new RepositorioPublicaciones();

// Referencias a elementos del DOM
const formPublicacion = document.getElementById("form-publicacion");
const divVistaPrevia = document.getElementById("vista-previa");
const listaPublicaciones = document.getElementById("lista-publicaciones");
const camposEspecificos = document.getElementById("campos-especificos");
const ayudaEmail = document.getElementById("ayuda-email");

// ==========================================
// 2. PARTE 2: OBSERVADOR DE EVENTOS
// ==========================================

function observarEvento(evento) {
  console.table({
    type: evento.type,
    target: evento.target.id,
    currentTarget: evento.currentTarget.id,
    timeStamp: Math.round(evento.timeStamp),
  });
}

formPublicacion.elements["titulo"].addEventListener("input", observarEvento);
formPublicacion.elements["tipo"].addEventListener("change", observarEvento);

// ==========================================
// 3. PARTE 3: VISTA PREVIA INCREMENTAL
// ==========================================

function actualizarVistaPrevia() {
  const nombre = formPublicacion.elements["autor"].value || "Autor";
  const texto = formPublicacion.elements["titulo"].value || "Sin título";
  const tipo = formPublicacion.elements["tipo"].value;

  divVistaPrevia.textContent = `${texto} — ${nombre} (${tipo})`;
}

formPublicacion.elements["titulo"].addEventListener(
  "input",
  actualizarVistaPrevia,
);
formPublicacion.elements["autor"].addEventListener(
  "input",
  actualizarVistaPrevia,
);
formPublicacion.elements["tipo"].addEventListener(
  "change",
  actualizarVistaPrevia,
);

// ==========================================
// 4. PARTE 4: CAMBIOS DINÁMICOS SEGÚN TIPO
// ==========================================

function actualizarCamposEspecificos() {
  const tipoSeleccionado = formPublicacion.elements["tipo"].value;

  if (tipoSeleccionado === "venta") {
    camposEspecificos.innerHTML = `
      <input id="precio" type="number" placeholder="Precio" required>
      <input id="stock" type="number" value="1" placeholder="Stock" required>
    `;
  } else {
    camposEspecificos.innerHTML = `
      <select id="modalidad">
        <option value="presencial">Presencial</option>
        <option value="virtual">Virtual</option>
      </select>
      <input id="duracion" type="number" placeholder="Minutos" required>
    `;
  }
}

formPublicacion.elements["tipo"].addEventListener(
  "change",
  actualizarCamposEspecificos,
);
