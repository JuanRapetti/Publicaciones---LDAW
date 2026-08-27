import PublicacionVenta from "./Publicacion.js";

export default class PublicacionVenta extends Publicacion {
  constructor(titulo, descripcion, autor, modalidad, duracion) {
    super(titulo, descripcion, autor);

    this.modalidad = modalidad;
    this.duracion = duracion;
    this.cliente = null;
  }

  mostrarResumen() {
    return `${super.mostrarResumen()} - Modalidad: ${this.modalidad} - Duración: ${this.duracion}`;
  }
}
