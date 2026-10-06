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

// Colección local para almacenar los datos planos que llegan en JSON desde Express
const repositorio = {
  publicaciones: [],
  cargarDesde(datos) {
    this.publicaciones = datos;
  },
  obtenerTodas() {
    return this.publicaciones;
  },
  buscarPorId(id) {
    return this.publicaciones.find((p) => Number(p.id) === Number(id));
  },
};

// ==========================================
// 2. FUNCIONES AUXILIARES Y DIAGNÓSTICO
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

function mostrarDiagnostico(publicaciones) {
  const contenedor = document.querySelector("#diagnostico-lista");
  if (!contenedor) return;
  contenedor.innerHTML = publicaciones
    .map((p) => `<li>${p.titulo} (${p.autor})</li>`)
    .join("");
}

// ==========================================
// 3. VALIDACIONES Y FORMULARIO REACTIVO
// ==========================================

function validarTitulo(mostrarError = true) {
  if (!inputTitulo) return true;
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
  if (!inputAutor) return true;
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
  if (!selectTipo || selectTipo.value !== "venta") return true;
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
  if (!divVistaPrevia) return;
  const tituloText = inputTitulo?.value.trim() || "Sin título";
  const autorText = inputAutor?.value.trim() || "...";
  const tipoText = selectTipo?.value || "";

  divVistaPrevia.textContent = `${tituloText} — ${autorText} (${tipoText})`;
}

function mostrarAyudaEmail() {
  if (ayudaEmail) ayudaEmail.textContent = "Usá un email válido del autor";
}

function ocultarAyudaEmail() {
  if (ayudaEmail) ayudaEmail.textContent = "";
}

// ==========================================
// 4. CAMBIOS DINÁMICOS SEGÚN TIPO
// ==========================================

function actualizarCamposEspecificos() {
  if (!camposEspecificos || !selectTipo) return;

  if (selectTipo.value === "venta") {
    camposEspecificos.innerHTML = `
      <input id="precio" name="precio" type="number" placeholder="Precio" required>
      <input id="stock" name="stock" type="number" value="1" placeholder="Stock" required>
    `;
    const inputPrecio = document.querySelector("#precio");
    if (inputPrecio) {
      inputPrecio.addEventListener("input", () => {
        validarPrecio(false);
        actualizarEstadoFormulario();
        actualizarVistaPrevia();
      });
      inputPrecio.addEventListener("blur", () => validarPrecio(true));
    }
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
// 5. RENDERIZADO EN EL DOM
// ==========================================

function agregarTarjeta(publicacion) {
  if (!listaPublicaciones) return;

  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");
  tarjeta.dataset.id = publicacion.id;

  const resumen = document.createElement("p");
  const desc = publicacion.descripcion || publicacion.contenido || "";
  resumen.textContent = `${publicacion.titulo || "Sin título"} — ${publicacion.autor || "Anónimo"}: ${desc}`;
  tarjeta.appendChild(resumen);

  const estadoElemento = document.createElement("p");
  const estaActiva = publicacion.activa !== undefined ? publicacion.activa : true;
  let textoEstado = estaActiva ? "Activa" : "Inactiva";
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
  if (!estaActiva) {
    botonBaja.disabled = true;
  }
  tarjeta.appendChild(botonBaja);

  listaPublicaciones.appendChild(tarjeta);
}

function renderizarPublicaciones() {
  if (!listaPublicaciones) return;
  listaPublicaciones.innerHTML = "";
  repositorio.obtenerTodas().forEach((pub) => agregarTarjeta(pub));
}

// ==========================================
// 6. ASINCRONÍA Y HANDLERS HTTP (FETCH)
// ==========================================

async function cargarPublicaciones(forzarError = false) {
  if (estado) estado.textContent = "Cargando publicaciones...";
  if (botonActualizar) botonActualizar.disabled = true;
  if (botonForzarError) botonForzarError.disabled = true;

  try {
    const url = forzarError ? "/api/publicaciones?error=1" : "/publicaciones";
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error("La respuesta no fue exitosa");

    const datos = await respuesta.json();
    repositorio.cargarDesde(datos);
    renderizarPublicaciones();
    if (estado) estado.textContent = `${datos.length} publicaciones recibidas`;
  } catch (error) {
    if (estado) estado.textContent = `Error: ${error.message}`;
  } finally {
    if (botonActualizar) botonActualizar.disabled = false;
    if (botonForzarError) botonForzarError.disabled = false;
  }
}

async function manejarEnvio(evento) {
  evento.preventDefault();

  if (!validarTitulo(true) || !validarAutor(true) || !validarPrecio(true)) {
    return;
  }

  if (botonEnviar) botonEnviar.disabled = true;
  if (estado) estado.textContent = "Publicando...";

  try {
    // 1. Enviamos el formulario al servidor mediante fetch con urlencoded (Clase 16)
    const respuesta = await fetch(formPublicacion.action, {
      method: formPublicacion.method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(new FormData(formPublicacion)),
    });

    if (!respuesta.ok) {
      const errorTexto = await respuesta.text();
      throw new Error(errorTexto || "Error al realizar la publicación");
    }

    if (estado) estado.textContent = "Publicación agregada con éxito";

    // 2. Si fue exitoso, limpiamos el formulario y refrescamos la lista desde el servidor
    formPublicacion.reset();
    actualizarCamposEspecificos();
    actualizarVistaPrevia();
    await cargarPublicaciones();
  } catch (error) {
    if (estado) estado.textContent = `Error: ${error.message}`;
  } finally {
    actualizarEstadoFormulario();
  }
}

function manejarAccion(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton || !listaPublicaciones?.contains(boton)) return;

  const tarjeta = boton.closest("[data-id]");
  const id = Number(tarjeta.dataset.id);
  const accion = boton.dataset.accion;

  const publicacion = repositorio.buscarPorId(id);
  if (!publicacion) return;

  if (accion === "baja") publicacion.activa = false;
  if (accion === "destacar") publicacion.destacada = !publicacion.destacada;

  renderizarPublicaciones();
}

// ==========================================
// 7. LISTENERS E INICIALIZACIÓN
// ==========================================

if (inputTitulo) inputTitulo.addEventListener("input", observarEvento);
if (selectTipo) selectTipo.addEventListener("change", observarEvento);

if (inputEmail) {
  inputEmail.addEventListener("focus", mostrarAyudaEmail);
  inputEmail.addEventListener("blur", ocultarAyudaEmail);
}

if (inputTitulo) {
  inputTitulo.addEventListener("input", () => validarTitulo(false));
  inputTitulo.addEventListener("blur", () => validarTitulo(true));
}

if (inputAutor) {
  inputAutor.addEventListener("input", () => validarAutor(false));
  inputAutor.addEventListener("blur", () => validarAutor(true));
}

if (formPublicacion) {
  formPublicacion.addEventListener("input", () => {
    actualizarVistaPrevia();
    actualizarEstadoFormulario();
  });
  formPublicacion.addEventListener("submit", manejarEnvio);
}

if (selectTipo) {
  selectTipo.addEventListener("change", () => {
    actualizarCamposEspecificos();
    actualizarVistaPrevia();
  });
}

if (listaPublicaciones) {
  listaPublicaciones.addEventListener("click", manejarAccion);
}

if (botonActualizar) {
  botonActualizar.addEventListener("click", () => cargarPublicaciones(false));
}
if (botonForzarError) {
  botonForzarError.addEventListener("click", () => cargarPublicaciones(true));
}

// Diagnóstico JSON y XML en Cliente (Paso 5A y 5B)
document.querySelector("#ver-json")?.addEventListener("click", async () => {
  try {
    const texto = await fetch("/datos/publicaciones.json").then((r) => r.text());
    const publicaciones = JSON.parse(texto);
    mostrarDiagnostico(publicaciones);
  } catch (err) {
    console.error(err);
  }
});

document.querySelector("#ver-xml")?.addEventListener("click", async () => {
  try {
    const texto = await fetch("/datos/publicaciones.xml").then((r) => r.text());
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(texto, "application/xml");

    const nodos = Array.from(xmlDoc.querySelectorAll("publicacion"));
    const publicaciones = nodos.map((nodo) => ({
      id: Number(nodo.getAttribute("id")),
      autor: nodo.querySelector("autor")?.textContent ?? "",
      titulo: nodo.querySelector("titulo")?.textContent ?? "",
      contenido: nodo.querySelector("contenido")?.textContent ?? "",
      activa: nodo.querySelector("activa")?.textContent === "true",
      destacada: nodo.querySelector("destacada")?.textContent === "true",
      estado: nodo.querySelector("estado")?.textContent ?? "",
    }));

    mostrarDiagnostico(publicaciones);
  } catch (err) {
    console.error(err);
  }
});

// Consultas de estado
const parrafoEstado = document.querySelector("#parrafo-estado");
const botonConsultar = document.querySelector("#consultar");
const botonConsultarInactivas = document.querySelector("#consultar-inactivas");

if (botonConsultar) {
  botonConsultar.addEventListener("click", async () => {
    if (parrafoEstado) parrafoEstado.textContent = "Consultando...";
    try {
      const respuesta = await fetch("/estado-comunidad");
      if (!respuesta.ok) throw new Error("La respuesta no fue exitosa");
      const texto = await respuesta.text();
      if (parrafoEstado) parrafoEstado.textContent = texto;
    } catch (error) {
      if (parrafoEstado) parrafoEstado.textContent = `No se pudo consultar el estado: ${error.message}`;
    }
  });
}

if (botonConsultarInactivas) {
  botonConsultarInactivas.addEventListener("click", async () => {
    if (parrafoEstado) parrafoEstado.textContent = "Consultando inactivas...";
    try {
      const respuesta = await fetch("/estado-inactivas");
      if (!respuesta.ok) throw new Error("La respuesta no fue exitosa");
      const texto = await respuesta.text();
      if (parrafoEstado) parrafoEstado.textContent = texto;
    } catch (error) {
      if (parrafoEstado) parrafoEstado.textContent = `No se pudo consultar el estado: ${error.message}`;
    }
  });
}

// Carga inicial al refrescar o entrar a la página
actualizarCamposEspecificos();
actualizarVistaPrevia();
cargarPublicaciones();