import Publicacion from "./Publicacion.js";

export default class PublicacionVenta extends Publicacion {
  constructor(titulo, descripcion, autor, precio) {
    super(titulo, descripcion, autor);
    this.precio = precio;
    this.stock = 1;
  }

  mostrarResumen() {
    return `${super.mostrarResumen()} - Precio:$ ${this.precio} - Stock: ${this.stock}`;
  }
}
