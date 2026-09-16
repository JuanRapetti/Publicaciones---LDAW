import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
/*import RepositorioPublicaciones from "./RepositorioPublicaciones.js"; */

// ==========================================
// 1. INICIALIZACIÓN Y REFERENCIAS AL DOM
// ==========================================

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

const publicaciones = [];

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
// 5. AYUDA VISUAL (BLUR Y FOCUS)
// ==========================================

function mostrarAyudaEmail() {
  ayudaEmail.textContent = "Usá un email válido del autor";
}
function ocultarAyudaEmail() {
  ayudaEmail.textContent = "";
}
inputEmail.addEventListener("focus", mostrarAyudaEmail);
inputEmail.addEventListener("blur", ocultarAyudaEmail);

// ==========================================
// 6. CREACIÓN Y RENDERIZADO DE PUBLICACIONES
// ==========================================

function crearPublicacionDesdeFormulario() {
  const usuario = new Usuario(inputAutor.value, inputEmail.value);
  if (selectTipo.value === "venta") {
    return new PublicacionVenta(
      inputTitulo.value,
      inputDescripcion.value,
      usuario,
      Number(document.querySelector("#precio").value),
    );
  }
  return new PublicacionServicio(
    inputTitulo.value,
    inputDescripcion.value,
    usuario,
    document.querySelector("#modalidad").value,
    Number(document.querySelector("#duracion").value),
  );
}

function agregarTarjeta(publicacion) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");
  tarjeta.dataset.id = publicacion.id;

  const resumen = document.createElement("p");
  resumen.textContent = publicacion.mostrarResumen();
  tarjeta.appendChild(resumen);

  const estado = document.createElement("p");
  let textoEstado = publicacion.estaActiva() ? "Activa" : "Inactiva";
  if (publicacion.destacada) {
    textoEstado += " — ★ Destacada";
  }
  estado.textContent = textoEstado;
  tarjeta.appendChild(estado);

  // Botón Destacar
  const botonDestacar = document.createElement("button");
  botonDestacar.textContent = "Destacar";
  botonDestacar.dataset.accion = "destacar";
  tarjeta.appendChild(botonDestacar);

  // Botón Dar de baja
  const botonBaja = document.createElement("button");
  botonBaja.classList.add("button");
  botonBaja.textContent = "Dar de baja";
  botonBaja.dataset.accion = "baja";
  if (!publicacion.estaActiva()) {
    botonBaja.disabled = true;
  }
  tarjeta.appendChild(botonBaja);

  listaPublicaciones.appendChild(tarjeta);
}

function renderizarPublicaciones() {
  listaPublicaciones.innerHTML = "";
  publicaciones.forEach((pub) => agregarTarjeta(pub));
}

function manejarEnvio(evento) {
  evento.preventDefault();

  const publicacion = crearPublicacionDesdeFormulario();
  publicaciones.push(publicacion);

  formPublicacion.reset();
  actualizarCamposEspecificos();
  actualizarVistaPrevia();

  renderizarPublicaciones();
}

formPublicacion.addEventListener("submit", manejarEnvio);

// ==========================================
// 7. DELEGACIÓN DE EVENTOS EN LA LISTA
// ==========================================

function manejarAccion(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton || !listaPublicaciones.contains(boton)) return;

  const tarjeta = boton.closest("[data-id]");
  const id = Number(tarjeta.dataset.id);
  const accion = boton.dataset.accion;

  const publicacion = publicaciones.find((p) => p.id === id);
  if (!publicacion) return;

  if (accion === "baja") publicacion.darDeBaja();
  if (accion === "destacar") publicacion.destacar();

  renderizarPublicaciones();
}

listaPublicaciones.addEventListener("click", manejarAccion);

// ==========================================
// 8. INICIALIZACIÓN DE LA INTERFAZ
// ==========================================

actualizarCamposEspecificos();
actualizarVistaPrevia();
