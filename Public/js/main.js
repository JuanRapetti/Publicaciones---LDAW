import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

const repositorio = new RepositorioPublicaciones();

// ==========================================
// 1. REFERENCIAS AL DOM
// ==========================================
// DOM: Lista y asincronía
const listaPublicaciones = document.querySelector("#lista-publicaciones");
const estado = document.querySelector("#estado");
const botonActualizar = document.querySelector("#boton-actualizar");
const botonForzarError = document.querySelector("#boton-forzar-error");

// DOM: TP15 - Estado de comunidad
const parrafoEstado = document.querySelector("#parrafo-estado");
const botonConsultar = document.querySelector("#consultar");
const botonConsultarInactivas = document.querySelector("#consultar-inactivas");

// DOM: TP16 - Formulario nuevo y Vista Previa
const formulario = document.querySelector("#pedido");
const salida = document.querySelector("#salida");
const divVistaPrevia = document.querySelector("#vista-previa");
const inputTitulo = formulario.querySelector("[name='titulo']");
const inputAutor = formulario.querySelector("[name='autor']");
const selectCategoria = formulario.querySelector("[name='categoria']");

// ==========================================
// 2. RENDERIZADO Y DOMINIO
// ==========================================
function agregarTarjeta(publicacion) {
  const tarjeta = document.createElement("article");
  tarjeta.classList.add("tarjeta");
  tarjeta.dataset.id = publicacion.id;

  const resumen = document.createElement("p");
  resumen.textContent = publicacion.mostrarResumen();
  tarjeta.appendChild(resumen);

  const estadoElemento = document.createElement("p");
  let textoEstado = publicacion.estaActiva() ? "Activa" : "Inactiva";
  if (publicacion.destacada) textoEstado += " — ★ Destacada";
  
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
  if (!publicacion.estaActiva()) botonBaja.disabled = true;
  
  tarjeta.appendChild(botonBaja);
  listaPublicaciones.appendChild(tarjeta);
}

function renderizarPublicaciones() {
  listaPublicaciones.innerHTML = "";
  repositorio.obtenerTodas().forEach((pub) => agregarTarjeta(pub));
}

// ==========================================
// 3. ASINCRONÍA Y HANDLERS DE LISTA
// ==========================================
async function cargarPublicaciones(forzarError = false) {
  estado.textContent = "Cargando publicaciones...";
  if (botonActualizar) botonActualizar.disabled = true;
  if (botonForzarError) botonForzarError.disabled = true;

  try {
    const url = forzarError ? "/api/publicaciones?error=1" : "/api/publicaciones";
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

function manejarAccion(evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton || !listaPublicaciones.contains(boton)) return;

  const tarjeta = boton.closest("[data-id]");
  const id = Number(tarjeta.dataset.id);
  const publicacion = repositorio.buscarPorId(id);
  
  if (!publicacion) return;

  if (boton.dataset.accion === "baja") publicacion.darDeBaja();
  if (boton.dataset.accion === "destacar") publicacion.destacar();

  renderizarPublicaciones();
}

// ==========================================
// 4. TP 15 - CONSULTAS DE ESTADO REFACTORIZADAS
// ==========================================
async function consultarEstadoServidor(url, mensajeCarga) {
  if (!parrafoEstado) return;
  parrafoEstado.textContent = mensajeCarga;
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error("La respuesta no fue exitosa");
    parrafoEstado.textContent = await respuesta.text();
  } catch (error) {
    parrafoEstado.textContent = `Error al consultar: ${error.message}`;
  }
}

// ==========================================
// 5. TP 16 - ALTA Y VISTA PREVIA
// ==========================================
function actualizarVistaPrevia() {
  if (!divVistaPrevia) return; 
  const tituloText = inputTitulo?.value.trim() || "Sin título";
  const autorText = inputAutor?.value.trim() || "...";
  const categoriaText = selectCategoria?.value || "";

  divVistaPrevia.textContent = `${tituloText} — ${autorText} (${categoriaText})`;
}

async function manejarEnvioFormulario(evento) {
  evento.preventDefault(); // Evita recargar la página[cite: 1]

  try {
    // Envío usando fetch asíncrono leyendo la configuración del HTML[cite: 1]
    const respuesta = await fetch(formulario.action, {
      method: formulario.method,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(new FormData(formulario)),
    });

    salida.textContent = await respuesta.text();
    salida.dataset.tipo = respuesta.ok ? "exito" : "error"; // Diferencia visualmente éxito y error[cite: 1]

    if (respuesta.ok) {
      formulario.reset(); // Solo limpia los datos si fue válido[cite: 1]
      actualizarVistaPrevia();
      cargarPublicaciones(); // Refresca la lista de tarjetas
    }
  } catch (error) {
    salida.textContent = `No se pudo enviar: ${error.message}`;
    salida.dataset.tipo = "error";
  }
}

// ==========================================
// 6. LISTENERS E INICIALIZACIÓN
// ==========================================
// Eventos Lista
listaPublicaciones?.addEventListener("click", manejarAccion);
botonActualizar?.addEventListener("click", () => cargarPublicaciones(false));
botonForzarError?.addEventListener("click", () => cargarPublicaciones(true));

// Eventos TP15
botonConsultar?.addEventListener("click", () => consultarEstadoServidor("/estado-comunidad", "Consultando..."));
botonConsultarInactivas?.addEventListener("click", () => consultarEstadoServidor("/estado-inactivas", "Consultando inactivas..."));

// Eventos TP16 (Formulario y Vista Previa)
formulario?.addEventListener("submit", manejarEnvioFormulario);
[inputTitulo, inputAutor, selectCategoria].forEach((control) => {
  control?.addEventListener("input", actualizarVistaPrevia);
});

// Inicialización de la vista previa al cargar la página
actualizarVistaPrevia();