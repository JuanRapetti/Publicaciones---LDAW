import Publicacion from "./Publicacion.js";

export class PublicacionVenta extends Publicacion {
  constructor(titulo, descripcion, autor, precio, categoria = "compraventa") {
    super(autor, titulo, descripcion, categoria);

    const precioNum = Number(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      throw new Error("El precio debe ser un número mayor a 0");
    }

    this.precio = precioNum;
    this.stock = 1;
  }

  mostrarResumen() {
    return `${super.mostrarResumen()} - Precio: $${this.precio} - Stock: ${this.stock}`;
  }
}

export default PublicacionVenta;
