import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import { validarPublicacion } from "./validaciones.js";

// Heredamos de EventTarget (Nativo del navegador, no requiere imports, no rompe chrome)
export default class RepositorioPublicaciones extends EventTarget {
  constructor() {
    super();
    this.publicaciones = [];
  }

  agregar(publicacion, reglas = null) {
    if (reglas && !validarPublicacion(publicacion, reglas)) {
      console.log(
        `[Error]: La publicación "${publicacion.titulo}" no superó la validación.`,
      );
      return false;
    }

    this.publicaciones.push(publicacion);

    // Dispara un evento nativo del navegador
    this.dispatchEvent(
      new CustomEvent("publicacionAgregada", { detail: publicacion }),
    );
    return true;
  }

  cargarDesde(datos) {
    this.publicaciones = datos.map((item) => {
      const usuario = new Usuario(item.autor.nombre, item.autor.email);
      let pub;

      if (item.tipo === "venta") {
        pub = new PublicacionVenta(
          item.titulo,
          item.descripcion,
          usuario,
          item.precio,
        );
      } else {
        pub = new PublicacionServicio(
          item.titulo,
          item.descripcion,
          usuario,
          item.modalidad,
          item.duracion,
        );
      }

      pub.id = item.id || Date.now();
      if (!item.activa) pub.darDeBaja();
      if (item.destacada) pub.destacar();
      return pub;
    });

    this.dispatchEvent(new CustomEvent("publicacionesCargadas"));
  }

  obtenerTodas() {
    return this.publicaciones;
  }

  buscarPorId(id) {
    return this.publicaciones.find((p) => p.id === id);
  }

  buscarPorUsuario(nombreUsuario) {
    return this.publicaciones.filter((publicacion) =>
      publicacion.esDeAutor(nombreUsuario),
    );
  }

  filtrarActivas() {
    return this.publicaciones.filter((publicacion) => publicacion.estaActiva());
  }

  cantidadTotal() {
    return this.publicaciones.length;
  }

  listarResumenes() {
    return this.publicaciones.map((publicacion) =>
      publicacion.mostrarResumen(),
    );
  }

  filtrarPorClase(claseConstructor) {
    return this.publicaciones.filter(
      (publicacion) => publicacion instanceof claseConstructor,
    );
  }
}
