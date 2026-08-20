export default class RepositorioPublicaciones {
  publicaciones;

  constructor() {
    this.publicaciones = [];
  }

  agregar(publicacion) {
    this.publicaciones.push(publicacion);
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
}
