export default class Usuario {
  //atts
  nombre;
  email;
  fechaRegistro;

  //const
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
    this.fechaRegistro = new Date();

    this.contactos = [];
  }

  mostrarPerfil() {
    return `Nombre: ${this.nombre} Email: ${this.email}`;
  }

  agregarContacto(otroUsuario) {
    this.contactos.push(otroUsuario);
  }
}
