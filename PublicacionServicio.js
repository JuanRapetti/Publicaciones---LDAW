import PublicacionVenta from "./Publicacion.js";

export default class PublicacionVenta extends Publicacion {
  constructor(titulo, descripcion, autor, modalidad, duracion) {
    //Super() debe utilizarse antes que this, ya que super() llama al constructor de la clase padre y establece el contexto de this para la subclase. (Espero q este bien el autocompletado se mando todo ese texto a partir de 2 palabras)
    super(titulo, descripcion, autor);

    this.modalidad = modalidad;
    this.duracion = duracion;
  }

  mostrarResumen() {
    return `${super.mostrarResumen()} - Modalidad: ${this.modalidad} - Duración: ${this.duracion}`;
  }
}
