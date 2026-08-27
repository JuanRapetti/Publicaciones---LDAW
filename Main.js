import Usuario from "./Usuario.js";
import Publicacion from "./Publicacion.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

// ==========================================
// 1. INICIALIZACIÓN DEL REPOSITORIO Y REGLAS
// ==========================================

const repositorio = new RepositorioPublicaciones();

// Reglas globales que se le pasarán al repositorio al momento de agregar
const reglasDeValidacion = {
  longitudMinimaTitulo: 5,
  precioMinimo: 10,
};

// ==========================================
// 2. LISTENERS (PRÁCTICA 6 - EVENT EMITTER)
// ==========================================

repositorio.on("publicacionAgregada", (publicacion) => {
  console.log(
    `[Listener 1 - Log]: Se agregó la publicación -> "${publicacion.titulo}"`,
  );
});

repositorio.on("publicacionAgregada", (publicacion) => {
  console.log(
    `[Listener 2 - Métrica]: Total de publicaciones en repositorio -> ${repositorio.publicaciones.length}`,
  );
});

// ==========================================
// 3. INSTANCIACIÓN DE USUARIOS
// ==========================================

const autor1 = new Usuario("Juan Pérez", "juan.perez@example.com");
const autor2 = new Usuario("María López", "maria.lopez@example.com");
const autor3 = new Usuario("Carlos García", "carlos.garcia@example.com");
const autor4 = new Usuario("Ana Torres", "ana.torres@example.com");

// ==========================================
// 4. INSTANCIACIÓN DE PUBLICACIONES
// ==========================================

const publicacion1 = new PublicacionVenta(
  "Busco apuntes algebra",
  "Busco apuntes de algebra analitica para mi clase",
  autor1,
  5000,
);

const publicacion2 = new PublicacionServicio(
  "Necesito ayuda con programación",
  "Estoy teniendo problemas con un ejercicio de programación de poo",
  autor2,
  "Virtual",
  "1 hora",
);

const publicacion3 = new PublicacionServicio(
  "Busco ayuda con matemáticas",
  "Necesito ayuda con los ejercicios de matemáticas 1",
  autor3,
  "Presencial",
  "2 horas",
);
publicacion3.activa = false;

const publicacion4 = new PublicacionVenta(
  "Vendo libros de texto",
  "Tengo libros de texto que ya no necesito sobre patrones de diseño",
  autor4,
  10000,
);

const publicacion5 = new PublicacionServicio(
  "Ofrezco clases particulares",
  "Ofrezco clases particulares de matemáticas y física para estudiantes de secundaria",
  autor1,
  "Presencial",
  "2 horas",
);
publicacion5.activa = false;

const publicacion6 = new PublicacionVenta(
  "Vendo calculadora científica",
  "Calculadora científica usada en buen estado",
  autor1,
  15000,
);

const publicacion7 = new PublicacionServicio(
  "Ofrezco clases de física",
  "Clases particulares de física para estudiantes de secundaria",
  autor2,
  "Virtual",
  "90 minutos",
);

const publicacionesIniciales = [
  publicacion1,
  publicacion2,
  publicacion3,
  publicacion4,
  publicacion5,
  publicacion6,
  publicacion7,
];

// ==========================================
// 5. CARGA EN EL REPOSITORIO
// ==========================================

console.log("==========================================");
console.log("CARGA DE PUBLICACIONES AL REPOSITORIO");
console.log("==========================================");

// repositorio.agregar() maneja internamente la validación recibiendo las reglas como parámetro
publicacionesIniciales.forEach((pub) => {
  repositorio.agregar(pub, reglasDeValidacion);
});

// ==========================================
// 6. PRUEBAS MÉTODOS POLIMÓRFICOS Y FILTROS
// ==========================================

console.log("\n==========================================");
console.log("1. RESÚMENES POLIMÓRFICOS (listarResumenes)");
console.log("==========================================");

if (typeof repositorio.listarResumenes === "function") {
  repositorio.listarResumenes().forEach((resumen) => console.log(resumen));
} else {
  publicacionesIniciales.forEach((pub) => console.log(pub.mostrarResumen()));
}

console.log("\n==========================================");
console.log("2. FILTRAR POR TIPO (filtrarPorTipo)");
console.log("==========================================");

if (typeof repositorio.filtrarPorTipo === "function") {
  const servicios = repositorio.filtrarPorTipo(PublicacionServicio);
  console.log(`Servicios encontrados: ${servicios.length}`);
  servicios.forEach((s) => console.log(`- ${s.titulo}`));
}

console.log("\n==========================================");
console.log("3. AUTO-ASOCIACIÓN CONTACTOS (USUARIO)");
console.log("==========================================");

autor1.agregarContacto(autor2);
autor1.agregarContacto(autor3);

console.log(`Contactos de ${autor1.nombre}:`);
autor1.contactos.forEach((contacto) => {
  console.log(` - ${contacto.nombre}`);
});

// ==========================================
// 7. OPERACIONES ASINCRÓNICAS (PRÁCTICA 6)
// ==========================================

function publicarConDemora(publicacion, callback) {
  console.log("\nIniciando publicación con demora (Callback)...");
  setTimeout(() => {
    repositorio.agregar(publicacion, reglasDeValidacion);
    if (callback) callback(publicacion);
  }, 2000);
}

function esperarDemora(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function publicarConDemoraAsync(publicacion) {
  console.log("\nIniciando publicación con demora (Async/Await)...");
  await esperarDemora(2000);
  repositorio.agregar(publicacion, reglasDeValidacion);
  console.log(`Publicación async lista: "${publicacion.titulo}"`);
}

// Ejecución de pruebas asincrónicas en secuencia
(async function ejecutarPruebasAsincronicas() {
  console.log("\n==========================================");
  console.log("4. PRUEBAS ASINCRÓNICAS");
  console.log("==========================================");

  // Prueba Callback
  console.log("--- INICIO PRUEBA CALLBACK ---");
  const pubCallback = new PublicacionVenta(
    "Publicación con Callback",
    "Descripción válida de prueba con callback",
    autor1,
    2000,
  );

  publicarConDemora(pubCallback, (pub) => {
    console.log(`Callback ejecutado: "${pub.titulo}" fue procesada con éxito.`);
  });
  console.log(
    "-> Mensaje síncrono: Este log aparece INMEDIATAMENTE después de llamar a publicarConDemora.",
  );

  // Pausa para que no se pisen las consolas de Callback y Async/Await
  await esperarDemora(2500);

  // Prueba Async/Await
  console.log("\n--- INICIO PRUEBA ASYNC/AWAIT ---");
  const pubAsync = new PublicacionVenta(
    "Publicación Async/Await",
    "Descripción válida de prueba async/await",
    autor2,
    3000,
  );

  await publicarConDemoraAsync(pubAsync);
  console.log(
    "-> Mensaje tras await: Este log aparece DESPUÉS de que termina la publicación async.",
  );
})();
