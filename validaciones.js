export function validarPublicacion(publicacion, reglas) {
  // Validar título según la regla definida
  if (
    reglas.longitudMinimaTitulo &&
    publicacion.titulo.length < reglas.longitudMinimaTitulo
  ) {
    return false;
  }

  // Validar precio si la regla existe y la publicación posee atributo precio
  if (reglas.precioMinimo !== undefined && publicacion.precio !== undefined) {
    if (publicacion.precio < reglas.precioMinimo) {
      return false;
    }
  }

  return true; // Si pasó todas las reglas
}
