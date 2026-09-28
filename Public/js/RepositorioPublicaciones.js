import Usuario from "./Usuario.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import { validarPublicacion } from "./validaciones.js";
import Publicacion from "./Publicacion.js"; 

// Heredamos de EventTarget (Nativo del navegador, no requiere imports, no rompe chrome)
export class RepositorioPublicaciones extends EventTarget {
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
      // El servidor serializa la publicación tal cual: el autor puede venir como
      // String u objeto, y el texto como "contenido" (o "descripcion" en datos viejos).
      const autorEsObjeto = typeof item.autor === "object" && item.autor !== null;
      const nombreAutor = autorEsObjeto ? item.autor.nombre : item.autor;
      const emailAutor = autorEsObjeto ? item.autor.email : "";
      const usuario = new Usuario(nombreAutor, emailAutor);
      const descripcion = item.descripcion ?? item.contenido;

      let pub;
      if (item.tipo === "venta") {
        pub = new PublicacionVenta(item.titulo, descripcion, usuario, item.precio);
      } else if (item.tipo === "servicio") {
        pub = new PublicacionServicio(
          item.titulo,
          descripcion,
          usuario,
          item.modalidad,
          item.duracion,
        );
      } else {
        // Publicaciones creadas por POST /publicaciones (clase base)
        pub = new Publicacion(usuario, item.titulo, descripcion, item.categoria ?? "general");
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

  buscarPorEtiqueta(etiqueta) {
    return this.publicaciones.filter(
      (publicacion) =>
        publicacion.activa && publicacion.tieneEtiqueta(etiqueta),
    );
  }

  obtenerEstado() {
    const activas = this.publicaciones.filter((p) => p.activa).length;
    return `Publicaciones activas: ${activas}`;
  }

  obtenerEstadoInactivas() {
    const inactivas = this.publicaciones.filter((p) => !p.activa).length;
    return `Publicaciones inactivas: ${inactivas}`;
  }

  pendientesDeRevision() {
    return this.publicaciones.filter((p) => p.activa && p.requiereRevision());
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

export default RepositorioPublicaciones;
