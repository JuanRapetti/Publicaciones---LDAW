export default class usuario {
  //atts
  nombre;
  email;
  fechaRegistro;

  //const
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
    this.fechaRegistro = new Date();
  }

  mostrarPerfil() {
    return `Nombre: ${this.nombre} Email: ${this.email}`;
  }
}
