import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
/*import RepositorioPublicaciones from "./RepositorioPublicaciones.js"; */

// ==========================================
// 1. INICIALIZACIÓN Y REFERENCIAS AL DOM
// ==========================================

/*const repositorio = new RepositorioPublicaciones();*/

const formPublicacion = document.getElementById("form-publicacion");
const selectTipo = document.getElementById("tipo");
const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const inputEmail = document.getElementById("email");
const inputDescripcion = document.getElementById("descripcion");
const camposEspecificos = document.getElementById("campos-especificos");
const divVistaPrevia = document.getElementById("vista-previa");
const listaPublicaciones = document.getElementById("lista-publicaciones");
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

inputTitulo.addEventListener("input", observarEvento);
selectTipo.addEventListener("change", observarEvento);

// ==========================================
// 3. PARTE 3: VISTA PREVIA INCREMENTAL
// ==========================================

function actualizarVistaPrevia() {
  const nombre = inputAutor.value || "Autor";
  const texto = inputTitulo.value || "Sin título";
  const tipo = selectTipo.value;

  divVistaPrevia.textContent = `${texto} — ${nombre} (${tipo})`;
}

inputTitulo.addEventListener("input", actualizarVistaPrevia);
inputAutor.addEventListener("input", actualizarVistaPrevia);
selectTipo.addEventListener("change", actualizarVistaPrevia);

// ==========================================
// 4. PARTE 4: CAMBIOS DINÁMICOS SEGÚN TIPO
// ==========================================

function actualizarCamposEspecificos() {
  if (selectTipo.value === "venta") {
    camposEspecificos.innerHTML = `
      <input id="precio" name="precio" type="number" placeholder="Precio" required>
      <input id="stock" name="stock" type="number" value="1" placeholder="Stock" required>
    `;
  } else {
    camposEspecificos.innerHTML = `
      <select id="modalidad" name="modalidad">
        <option value="presencial">Presencial</option>
        <option value="virtual">Virtual</option>
      </select>
      <input id="duracion" name="duracion" type="number" placeholder="Minutos" required>
    `;
  }
}

selectTipo.addEventListener("change", actualizarCamposEspecificos);

// ==========================================
// 7. INICIALIZACIÓN DE LA INTERFAZ
// ==========================================

actualizarCamposEspecificos();
actualizarVistaPrevia();
