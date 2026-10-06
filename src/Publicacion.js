import { Reporte } from "./Reporte.js";

export class Publicacion {
  constructor(id, autor, titulo, contenido) {
    this.id = id;
    this.autor = autor;
    this.titulo = titulo;
    this.contenido = contenido;
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
    return `${this.titulo}\n${nombreAutor}`;
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
