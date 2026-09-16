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
const botonPublicar = document.getElementById("boton-publicar");

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

//EJ 5 BLUR Y FOCUS
function mostrarAyudaEmail() {
  ayudaEmail.textContent = "Usá un email válido del autor";
}
function ocultarAyudaEmail() {
  ayudaEmail.textContent = "";
}
inputEmail.addEventListener("focus", mostrarAyudaEmail);
inputEmail.addEventListener("blur", ocultarAyudaEmail);

//EJ 6
const publicaciones = [];
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
function manejarEnvio(evento) {
  // Previene el comportamiento por defecto de recargar la página
  evento.preventDefault();

  // Crea la instancia de la publicación a partir de los datos del formulario
  const publicacion = crearPublicacionDesdeFormulario();

  // Guarda la nueva publicación en la colección
  publicaciones.push(publicacion);

  // Limpia el formulario
  formPublicacion.reset();

  // Restablece los campos específicos y la vista previa a sus estados iniciales
  actualizarCamposEspecificos();
  actualizarVistaPrevia();

  // Redibuja la lista completa con la nueva publicación incluida
  renderizarPublicaciones();
}
formPublicacion.addEventListener("submit", manejarEnvio);

//cambios acorde a tp9 ej 2
function agregarTarjeta(publicacion) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");
  tarjeta.dataset.id = publicacion.id;

  const resumen = document.createElement("p");
  resumen.textContent = publicacion.mostrarResumen();
  tarjeta.appendChild(resumen);

  const estado = document.createElement("p");
  estado.textContent = publicacion.estaActiva() ? "Activa" : "Inactiva";
  tarjeta.appendChild(estado);

  function manejarBaja(evento) {
    console.log(evento.type, evento.target);
    publicacion.darDeBaja();
    estado.textContent = "Inactiva";
    botonBaja.disabled = true;
  }

  //tp9 ej 2 boton destacar
  const botonDestacar = document.createElement("button");
  botonDestacar.textContent = "Destacar";
  botonDestacar.dataset.action = "destacar";
  tarjeta.appendChild(botonDestacar);

  const botonBaja = document.createElement("button");
  botonBaja.classList.add("button");
  botonBaja.textContent = "Dar de baja";
  botonBaja.dataset.action = "baja";
  tarjeta.appendChild(botonBaja);

  botonBaja.addEventListener("click", manejarBaja);

  listaPublicaciones.appendChild(tarjeta);
}

//tp 9
//1
function observarClick(evento) {
  console.log("target", evento.target);
  console.log("currentTarget", evento.currentTarget);
}
listaPublicaciones.addEventListener("click", observarClick);

//ej 3
function manejarAccion(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton || !listaPublicaciones.contains(boton)) return;
  const tarjeta = boton.closest("[data-id]");
  const id = Number(tarjeta.dataset.id);
  console.log(id, boton.dataset.accion);

  const accion = boton.dataset.action;

  // 1. Buscar el objeto del dominio en el array por su ID
  const publicacion = publicaciones.find((p) => p.id === id);
  if (!publicacion) return;

  if (accion === "baja") publicacion.darDeBaja();
  if (accion === "destacar") publicacion.destacar();

  renderizarPublicaciones();
}
listaPublicaciones.addEventListener("click", manejarAccion);

//ej 4
function renderizarPublicaciones() {
  listaPublicaciones.innerHTML = ""; // Limpiamos la lista para evitar duplicados
  publicaciones.forEach((pub) => agregarTarjeta(pub));
}
