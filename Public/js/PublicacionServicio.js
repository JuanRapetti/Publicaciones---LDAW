import Publicacion from "./Publicacion.js";

export class PublicacionServicio extends Publicacion {
  constructor(
    titulo,
    descripcion,
    autor,
    modalidad,
    duracion,
    categoria = "general",
  ) {
    super(autor, titulo, descripcion, categoria);

    this.modalidad = modalidad;
    this.duracion = Number(duracion);
    this.cliente = null;
  }

  mostrarResumen() {
    return `${super.mostrarResumen()} - Modalidad: ${this.modalidad} - Duración: ${this.duracion} min`;
  }
}

export default PublicacionServicio;
