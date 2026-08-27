import { EventEmitter } from "node:events";
import { validarPublicacion } from "./validaciones.js";

export default class RepositorioPublicaciones extends EventEmitter {
  constructor() {
    super();
    this.publicaciones = [];
  }

  agregar(publicacion, reglas = null) {
    // Si se pasan reglas y no las cumple, interrumpe el flujo
    if (reglas && !validarPublicacion(publicacion, reglas)) {
      console.log(
        `[Error]: La publicación "${publicacion.titulo}" no superó la validación.`,
      );
      return false;
    }

    this.publicaciones.push(publicacion);
    this.emit("publicacionAgregada", publicacion);
    return true;
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
