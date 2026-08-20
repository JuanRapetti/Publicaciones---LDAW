import Usuario from "./Usuario.js";
import Publicacion from "./Publicacion.js";
import RepositorioPublicaciones from "./RepositorioPublicaciones.js";

const autor1 = new usuario("Juan Pérez", "juan.perez@example.com");
const autor2 = new usuario("María López", "maria.lopez@example.com");
const autor3 = new usuario("Carlos García", "carlos.garcia@example.com");
const autor4 = new usuario("Ana Torres", "ana.torres@example.com");

const publicacion1 = new Publicacion(
  "Busco apuntes algebra",
  "Busco apuntes de algebra analitica para mi clase",
  autor1,
);
const publicacion2 = new Publicacion(
  "Necesito ayuda con programación",
  "Estoy teniendo problemas con un ejercicio de programación de poo",
  autor2,
);
const publicacion3 = new Publicacion(
  "Busco ayuda con matemáticas",
  "Necesito ayuda con los ejercicios de matemáticas 1",
  autor3,
);

publicacion3.activa = false;

const publicacion4 = new Publicacion(
  "Vendo libros de texto",
  "Tengo libros de texto que ya no necesito sobre patrones de diseño",
  autor4,
);

const publicaciones = [publicacion1, publicacion2, publicacion3, publicacion4];

publicaciones.forEach((publicacion) => {
  console.log("--------------------");
  console.log(publicacion.mostrarResumen());
  console.log(`Activa: ${publicacion.estaActiva()}`);
  console.log();
});

const publicacion5 = new Publicacion(
  "Ofrezco clases particulares",
  "Ofrezco clases particulares de matemáticas y física para estudiantes de secundaria",
  autor1,
);
publicacion5.activa = false;

publicaciones.push(publicacion5);

//Publis activas

let publicacionesActivas = publicaciones.filter((publicacion) =>
  publicacion.estaActiva(),
);

let cantidadPublicacionesActivas = publicacionesActivas.length;
console.log("--------------------");
console.log();
console.log(
  `Cantidad de publicaciones activas: ${cantidadPublicacionesActivas}`,
);
console.log();
console.log("--------------------");
console.log("Publicaciones activas:");

publicacionesActivas.forEach((publicacion) => {
  console.log(`${publicacion.titulo}`);
});
console.log();
console.log("--------------------");

const publicacionesJSON = JSON.stringify(publicaciones, null, 2);
console.log(publicacionesJSON); // El método JSON.stringify() no incluye métodos de un objeto en la representación JSON, solamente se incluyen las propiedades del objeto. Por eso, console.log(publicacionesJSON) solo muestra los atributos de las publicaciones, como titulo, descripcion, autor, fechaPublicacion y activa.

const publicacion6 = new Publicacion(
  "Busco comisión para proyecto de Estructuras de Datos",
  "Estoy buscando comision para hacer el proyecto final de estructuras de datos",
  autor2,
);

//FIND

const primeraPublicacionMariaLopez = publicaciones.find((publicacion) =>
  publicacion.esDeAutor("María López"),
);

if (primeraPublicacionMariaLopez) {
  console.log("--------------------");
  console.log("Primera publicación de María López:");
  console.log(primeraPublicacionMariaLopez.mostrarResumen());
  console.log();
} else {
  console.log("María López no tiene publicaciones.");
}
