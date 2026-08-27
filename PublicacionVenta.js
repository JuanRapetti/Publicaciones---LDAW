import PublicacionVenta from "./Publicacion.js";

export default class PublicacionVenta extends PublicacionVenta {
  constructor(titulo, descripcion, autor, precio) {
    super(titulo, descripcion, autor);
    this.precio = precio;
    this.stock = 1;
  }
}
