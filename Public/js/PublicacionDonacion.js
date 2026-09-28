import Publicacion from "./Publicacion.js";
motivo;

export default class PublicacionDonacion extends Publicacion {
  constructor(titulo, descripcion, autor, motivo) {
    super(autor, titulo, descripcion);
    this.motivo = motivo;
  }
}
