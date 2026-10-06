// PASO 1: Contrato de datos público
export function paraExponer(publicacion) {
  return {
    id: publicacion.id,
    autor: publicacion.autor,
    titulo: publicacion.titulo,
    contenido: publicacion.contenido,
    activa: publicacion.activa,
    destacada: publicacion.destacada,
    etiquetas: publicacion.etiquetas ?? [],
    estado: publicacion.estado,
  };
}

// PASO 2: JSON
export function convertirAJSON(publicaciones) {
  const publicas = publicaciones.map(paraExponer);
  return JSON.stringify(publicas, null, 2);
}

export function convertirDesdeJSON(texto) {
  return JSON.parse(texto);
}

// PASO 3: XML
export function escaparXML(valor) {
  if (valor === null || valor === undefined) return "";
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function publicacionAXML(pub) {
  const exp = paraExponer(pub);

  const autorTexto =
    typeof exp.autor === "object" && exp.autor !== null
      ? (exp.autor.nombre ?? "")
      : exp.autor;

  const etiquetasXML = (exp.etiquetas || [])
    .map((e) => `<etiqueta>${escaparXML(e)}</etiqueta>`)
    .join("");

  return `  <publicacion id="${escaparXML(exp.id)}">
    <autor>${escaparXML(autorTexto)}</autor>
    <titulo>${escaparXML(exp.titulo)}</titulo>
    <contenido>${escaparXML(exp.contenido)}</contenido>
    <activa>${exp.activa}</activa>
    <destacada>${exp.destacada}</destacada>
    <etiquetas>${etiquetasXML}</etiquetas>
    <estado>${escaparXML(exp.estado)}</estado>
  </publicacion>`;
}

export function convertirAXML(publicaciones) {
  const lista = publicaciones.map(publicacionAXML).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<publicaciones>\n${lista}\n</publicaciones>`;
}
