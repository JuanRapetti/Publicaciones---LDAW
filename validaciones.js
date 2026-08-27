export function validarPublicacion(publicacion, reglas) {
  let publicacionValida = true;
  //validar longitud titulo
  if (
    reglas.longitudTituloMinima &&
    publicacion.titulo.length < reglas.longitudTituloMinima
  ) {
    publicacionValida = false;
  }

  //validar longitud descripcion
  if (
    reglas.longitudDescripcionMinima &&
    publicacion.descripcion.length < reglas.longitudDescripcionMinima
  ) {
    publicacionValida = false;
  }

  //validar autor
  if (reglas.autorRequerido && !publicacion.autor) {
    publicacionValida = false;
  }

  return publicacionValida;
}
