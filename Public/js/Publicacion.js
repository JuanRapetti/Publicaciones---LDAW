import { Reporte } from "./Reporte.js";

export const CATEGORIAS_PERMITIDAS = [
  "general",
  "aviso",
  "evento",
  "compraventa",
];

export class Publicacion {
  constructor(autor, titulo, descripcion, categoria = "general") {
    const nombreAutorStr =
      typeof autor === "object" && autor !== null ? autor.nombre : autor;

    if (!nombreAutorStr || !nombreAutorStr.trim()) {
      throw new Error("El autor es obligatorio");
    }

    const tituloNormalizado = titulo?.trim() ?? "";
    if (tituloNormalizado.length < 5 || tituloNormalizado.length > 80) {
      throw new Error("El título debe tener entre 5 y 80 caracteres");
    }

    const descripcionNormalizado = descripcion?.trim() ?? "";
    if (
      descripcionNormalizado.length < 20 ||
      descripcionNormalizado.length > 500
    ) {
      throw new Error("La descripcion debe tener entre 20 y 500 caracteres");
    }

    if (!CATEGORIAS_PERMITIDAS.includes(categoria)) {
      throw new Error(
        `La categoría debe ser una de: ${CATEGORIAS_PERMITIDAS.join(", ")}`,
      );
    }

    this.id = Date.now();
    this.autor =
      typeof autor === "object" && autor !== null ? autor : autor.trim();
    this.titulo = tituloNormalizado;
    this.descripcion = descripcionNormalizado;
    this.contenido = descripcionNormalizado;
    this.categoria = categoria;

    this.activa = true;
    this.destacada = false;
    this.etiquetas = [];
    this.reportes = [];
    this.estado = "pendiente";
  }

  reportar(usuario, motivo) {
    const yaReporto = this.reportes.some((r) => r.usuario === usuario);
    if (yaReporto) {
      throw new Error("El usuario ya reportó esta publicación");
    }
    this.reportes.push(new Reporte(usuario, motivo));
  }

  requiereRevision() {
    return this.reportes.length >= 3;
  }

  async revisar(servicioModeracion) {
    const decision = await servicioModeracion.evaluar(this);
    if (decision === "aprobado") {
      this.estado = "aprobada";
    } else if (decision === "rechazado") {
      this.estado = "rechazada";
    } else {
      throw new Error("Decisión de moderación inválida");
    }
    return this.estado;
  }

  agregarEtiqueta(etiqueta) {
    const normalizada = etiqueta.trim();
    if (!normalizada) {
      throw new Error("Etiqueta inválida");
    }
    const yaExiste = this.tieneEtiqueta(normalizada);
    if (!yaExiste) {
      this.etiquetas.push(normalizada);
    }
  }

  tieneEtiqueta(etiqueta) {
    const buscada = etiqueta.trim().toLowerCase();
    return this.etiquetas.some((e) => e.toLowerCase() === buscada);
  }

  mostrarResumen() {
    const nombreAutor =
      typeof this.autor === "object" && this.autor !== null
        ? this.autor.nombre || this.autor
        : this.autor;
    return `${this.titulo} - ${nombreAutor} (${this.categoria})`;
  }

  estaActiva() {
    return this.activa;
  }

  esDeAutor(nombre) {
    const nombreAutor =
      typeof this.autor === "object" && this.autor !== null
        ? this.autor.nombre
        : this.autor;
    return nombreAutor === nombre;
  }

  destacar() {
    this.destacada = true;
  }

  opacar() {
    this.destacada = false;
  }

  darDeBaja() {
    this.activa = false;
  }
}

export default Publicacion;
