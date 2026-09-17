import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

// ==========================================
// 1. REFERENCIAS AL DOM E INICIALIZACIÓN
// ==========================================

const formPublicacion = document.querySelector("#form-publicacion");
const selectTipo = document.querySelector("#tipo");
const inputTitulo = document.querySelector("#titulo");
const inputAutor = document.querySelector("#autor");
const inputEmail = document.querySelector("#email");
const inputDescripcion = document.querySelector("#descripcion");
const camposEspecificos = document.querySelector("#campos-especificos");
const divVistaPrevia = document.querySelector("#vista-previa");
const listaPublicaciones = document.querySelector("#lista-publicaciones");
const ayudaEmail = document.querySelector("#ayuda-email");

// Estado, asincronía y errores
const estado = document.querySelector("#estado");
const botonActualizar = document.querySelector("#boton-actualizar");
const botonForzarError = document.querySelector("#boton-forzar-error");
const botonEnviar = document.querySelector("#boton-publicar");
const errorTitulo = document.querySelector("#error-titulo");
const errorAutor = document.querySelector("#error-autor");

const repositorio = new RepositorioPublicaciones();

// ==========================================
// 2. FUNCIONES AUXILIARES
// ==========================================

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function observarEvento(evento) {
  console.table({
    type: evento.type,
    target: evento.target.id,
    currentTarget: evento.currentTarget.id,
    timeStamp: Math.round(evento.timeStamp),
  });
}

// ==========================================
// 3. VALIDACIONES Y FORMULARIO REACTIVO
// ==========================================

function validarTitulo(mostrarError = true) {
  const valido = inputTitulo.value.trim().length >= 5;
  inputTitulo.classList.toggle("valido", valido);
  inputTitulo.classList.toggle("invalido", !valido && mostrarError);
  if (errorTitulo) {
    errorTitulo.textContent =
      !valido && mostrarError ? "Ingrese al menos 5 caracteres" : "";
  }
  return valido;
}

function validarAutor(mostrarError = true) {
  const valido = inputAutor.value.trim().length >= 3;
  inputAutor.classList.toggle("valido", valido);
  inputAutor.classList.toggle("invalido", !valido && mostrarError);
  if (errorAutor) {
    errorAutor.textContent =
      !valido && mostrarError ? "Ingrese al menos 3 caracteres" : "";
  }
  return valido;
}

function validarPrecio(mostrarError = true) {
  if (selectTipo.value !== "venta") return true;
  const inputPrecio = document.querySelector("#precio");
  if (!inputPrecio) return false;

  const valido = Number(inputPrecio.value) > 0;
  inputPrecio.classList.toggle("valido", valido);
  inputPrecio.classList.toggle("invalido", !valido && mostrarError);
  return valido;
}

function formularioValido() {
  return validarTitulo(false) && validarAutor(false) && validarPrecio(false);
}

function actualizarEstadoFormulario() {
  if (botonEnviar) {
    botonEnviar.disabled = !formularioValido();
  }
}

function actualizarVistaPrevia() {
  const tituloText = inputTitulo.value.trim() || "Sin título";
  const autorText = inputAutor.value.trim() || "...";
  const tipoText = selectTipo.value;

  divVistaPrevia.textContent = `${tituloText} — ${autorText} (${tipoText})`;
}

function mostrarAyudaEmail() {
  ayudaEmail.textContent = "Usá un email válido del autor";
}

function ocultarAyudaEmail() {
  ayudaEmail.textContent = "";
}

// ==========================================
// 4. CAMBIOS DINÁMICOS SEGÚN TIPO
// ==========================================

function actualizarCamposEspecificos() {
  if (selectTipo.value === "venta") {
    camposEspecificos.innerHTML = `
      <input id="precio" name="precio" type="number" placeholder="Precio" required>
      <input id="stock" name="stock" type="number" value="1" placeholder="Stock" required>
    `;
    const inputPrecio = document.querySelector("#precio");
    inputPrecio.addEventListener("input", () => {
      validarPrecio(false);
      actualizarEstadoFormulario();
    });
    inputPrecio.addEventListener("blur", () => validarPrecio(true));
  } else {
    camposEspecificos.innerHTML = `
      <select id="modalidad" name="modalidad">
        <option value="presencial">Presencial</option>
        <option value="virtual">Virtual</option>
      </select>
      <input id="duracion" name="duracion" type="number" placeholder="Minutos" required>
    `;
  }
  actualizarEstadoFormulario();
}

// ==========================================
// 5. DOMINIO Y RENDERIZADO
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

  const estadoElemento = document.createElement("p");
  let textoEstado = publicacion.estaActiva() ? "Activa" : "Inactiva";
  if (publicacion.destacada) {
    textoEstado += " — ★ Destacada";
  }
  estadoElemento.textContent = textoEstado;
  tarjeta.appendChild(estadoElemento);

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
  repositorio.obtenerTodas().forEach((pub) => agregarTarjeta(pub));
}

// ==========================================
// 6. ASINCRONÍA Y HANDLERS DE EVENTOS
// ==========================================

async function cargarPublicaciones(forzarError = false) {
  estado.textContent = "Cargando publicaciones...";
  if (botonActualizar) botonActualizar.disabled = true;
  if (botonForzarError) botonForzarError.disabled = true;

  try {
    const url = forzarError
      ? "/api/publicaciones?error=1"
      : "/api/publicaciones";
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error("La respuesta no fue exitosa");

    const datos = await respuesta.json();
    repositorio.cargarDesde(datos);
    renderizarPublicaciones();
    estado.textContent = `${datos.length} publicaciones recibidas`;
  } catch (error) {
    estado.textContent = `Error: ${error.message}`;
  } finally {
    if (botonActualizar) botonActualizar.disabled = false;
    if (botonForzarError) botonForzarError.disabled = false;
  }
}

async function manejarEnvio(evento) {
  evento.preventDefault();
  if (!validarTitulo(true) || !validarAutor(true) || !validarPrecio(true))
    return;

  botonEnviar.disabled = true;
  estado.textContent = "Publicando...";

  try {
    await esperar(800);
    const publicacion = crearPublicacionDesdeFormulario();
    const agregada = repositorio.agregar(publicacion);

    if (agregada) {
      renderizarPublicaciones();
      estado.textContent = "Publicación agregada con éxito";
      formPublicacion.reset();
      actualizarVistaPrevia();
    } else {
      throw new Error("La publicación no superó las reglas del repositorio");
    }
  } catch (error) {
    estado.textContent = `Error: ${error.message}`;
  } finally {
    actualizarEstadoFormulario();
  }
}

function manejarAccion(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton || !listaPublicaciones.contains(boton)) return;

  const tarjeta = boton.closest("[data-id]");
  const id = Number(tarjeta.dataset.id);
  const accion = boton.dataset.accion;

  const publicacion = repositorio.buscarPorId(id);
  if (!publicacion) return;

  if (accion === "baja") publicacion.darDeBaja();
  if (accion === "destacar") publicacion.destacar();

  renderizarPublicaciones();
}

// ==========================================
// 7. LISTENERS E INICIALIZACIÓN
// ==========================================

// Observadores de consola
inputTitulo.addEventListener("input", observarEvento);
selectTipo.addEventListener("change", observarEvento);

// Ayuda email
inputEmail.addEventListener("focus", mostrarAyudaEmail);
inputEmail.addEventListener("blur", ocultarAyudaEmail);

// Validaciones y estado del formulario
inputTitulo.addEventListener("input", () => validarTitulo(false));
inputTitulo.addEventListener("blur", () => validarTitulo(true));

inputAutor.addEventListener("input", () => validarAutor(false));
inputAutor.addEventListener("blur", () => validarAutor(true));

formPublicacion.addEventListener("input", actualizarEstadoFormulario);
selectTipo.addEventListener("change", () => {
  actualizarCamposEspecificos();
  actualizarVistaPrevia();
});

// Vista previa reactiva
[inputTitulo, inputAutor, inputDescripcion, selectTipo].forEach((control) => {
  control.addEventListener("input", actualizarVistaPrevia);
});

// Envíos y acciones
formPublicacion.addEventListener("submit", manejarEnvio);
listaPublicaciones.addEventListener("click", manejarAccion);

if (botonActualizar)
  botonActualizar.addEventListener("click", () => cargarPublicaciones(false));
if (botonForzarError)
  botonForzarError.addEventListener("click", () => cargarPublicaciones(true));

// Carga inicial
actualizarCamposEspecificos();
actualizarVistaPrevia();
