import Usuario from "./Usuario.js";
import Publicacion from "./Publicacion.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

// ==========================
// USUARIOS
// ==========================

const autor1 = new Usuario("Juan Pérez", "juan.perez@example.com");
const autor2 = new Usuario("María López", "maria.lopez@example.com");
const autor3 = new Usuario("Carlos García", "carlos.garcia@example.com");
const autor4 = new Usuario("Ana Torres", "ana.torres@example.com");

// ==========================
// PUBLICACIONES
// ==========================

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
);

const publicacion3 = new PublicacionServicio(
  "Busco ayuda con matemáticas",
  "Necesito ayuda con los ejercicios de matemáticas 1",
  autor3,
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
);

publicacion5.activa = false;

// ==========================
// ARRAY DE PUBLICACIONES
// ==========================

const publicaciones = [
  publicacion1,
  publicacion2,
  publicacion3,
  publicacion4,
  publicacion5,
];

// ==========================
// FOREACH
// ==========================

publicaciones.forEach((publicacion) => {
  console.log("--------------------");
  console.log(publicacion.mostrarResumen());
  console.log(`Activa: ${publicacion.estaActiva()}`);
  console.log();
});

// ==========================
// FILTER
// ==========================

const publicacionesActivas = publicaciones.filter((publicacion) =>
  publicacion.estaActiva(),
);

console.log("--------------------");
console.log(
  `Cantidad de publicaciones activas: ${publicacionesActivas.length}`,
);
console.log("--------------------");
console.log("Publicaciones activas:");

publicacionesActivas.forEach((publicacion) => {
  console.log(publicacion.titulo);
});

console.log("--------------------");

// ==========================
// FIND
// ==========================

const primeraPublicacionJuanPerez = publicaciones.find((publicacion) =>
  publicacion.esDeAutor(autor1.nombre),
);

if (primeraPublicacionJuanPerez) {
  console.log("Primera publicación de Juan Pérez:");
  console.log(primeraPublicacionJuanPerez.mostrarResumen());
  console.log();
} else {
  console.log("Juan Pérez no tiene publicaciones.");
}

// ==========================
// INSTANCEOF
// ==========================

console.log("--------------------");
console.log("TEST INSTANCEOF");

publicaciones.forEach((publicacion) => {
  console.log(`${publicacion.titulo} -> ${publicacion instanceof Publicacion}`);
});

// ==========================
// JSON
// ==========================

const publicacionesJSON = JSON.stringify(publicaciones, null, 2);
console.log(publicacionesJSON);

// ==========================
// REPOSITORIO
// ==========================

const repositorio = new RepositorioPublicaciones();

publicaciones.forEach((publicacion) => {
  repositorio.agregar(publicacion);
});

// ==========================
// TEST: AGREGAR
// ==========================

const nuevaPublicacion = new PublicacionVenta(
  "Busco compañero de estudio",
  "Busco compañero para estudiar programación",
  autor1,
  5000,
);

repositorio.agregar(nuevaPublicacion);

console.log("--------------------");
console.log("TEST AGREGAR");
console.log("Publicación agregada:", nuevaPublicacion.titulo);

// ==========================
// TEST: BUSCAR POR USUARIO
// ==========================

console.log("--------------------");
console.log("TEST BUSCAR POR USUARIO");

const publicacionesJuan = repositorio.buscarPorUsuario(autor1.nombre);

if (publicacionesJuan.length > 0) {
  console.log(`Publicaciones de ${autor1.nombre}:`);

  publicacionesJuan.forEach((publicacion) => {
    console.log(publicacion.titulo);
  });
} else {
  console.log(`${autor1.nombre} no tiene publicaciones.`);
}
