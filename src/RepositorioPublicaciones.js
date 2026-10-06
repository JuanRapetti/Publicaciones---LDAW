import { readFile, writeFile } from "node:fs/promises";
import Usuario from "./Usuario.js";
import Publicacion from "./Publicacion.js";
import PublicacionVenta from "./PublicacionVenta.js";
import PublicacionServicio from "./PublicacionServicio.js";
import { validarPublicacion } from "./validaciones.js";

export class RepositorioPublicaciones extends EventTarget {
  constructor(ruta = null) {
    super();
    this.ruta = ruta;
    this.publicaciones = [];
    this.proximoId = 1;
  }

  // PASO 7A y 7B: Cargar desde archivo de persistencia
  async cargar() {
    if (!this.ruta) return;

    try {
      const contenido = await readFile(this.ruta, "utf8");
      const datos = JSON.parse(contenido);

      this.publicaciones = datos.map((item) => {
        const pub = new Publicacion(
          item.id,
          item.autor,
          item.titulo,
          item.contenido,
        );
        pub.activa = item.activa ?? true;
        pub.destacada = item.destacada ?? false;
        pub.etiquetas = item.etiquetas ?? [];
        pub.reportes = item.reportes ?? [];
        pub.estado = item.estado ?? "pendiente";
        return pub;
      });

      const maxId = this.publicaciones.reduce(
        (max, p) => (p.id > max ? p.id : max),
        0,
      );
      this.proximoId = maxId + 1;
    } catch (error) {
      if (error.code === "ENOENT") {
        await this.guardar();
      } else {
        throw error;
      }
    }
  }

  // PASO 8A: Guardar cambios en el archivo de disco
  async guardar() {
    if (!this.ruta) return;
    await writeFile(
      this.ruta,
      JSON.stringify(this.publicaciones, null, 2),
      "utf8",
    );
  }

  // Operación CRUD: Crear / Agregar (ahora es async)
  async agregar(autor, titulo, contenido, reglas = null) {
    let nuevaPub;

    if (autor instanceof Publicacion) {
      nuevaPub = autor;
      if (!nuevaPub.id) {
        nuevaPub.id = this.proximoId++;
      }
    } else {
      if (reglas && !validarPublicacion({ autor, titulo, contenido }, reglas)) {
        return false;
      }
      nuevaPub = new Publicacion(this.proximoId++, autor, titulo, contenido);
    }

    this.publicaciones.push(nuevaPub);
    await this.guardar();

    this.dispatchEvent(
      new CustomEvent("publicacionAgregada", { detail: nuevaPub }),
    );

    return nuevaPub;
  }

  // Operación CRUD: Listar
  listar() {
    return [...this.publicaciones];
  }

  obtenerTodas() {
    return this.listar();
  }

  // Operación CRUD: Buscar por ID
  buscarPorId(id) {
    const idNumerico = Number(id);
    return this.publicaciones.find((p) => p.id === idNumerico) || null;
  }

  // Operación CRUD: Actualizar (ahora es async)
  async actualizar(id, cambios = {}) {
    const anterior = this.buscarPorId(id);
    if (!anterior) {
      throw new Error("Publicación inexistente");
    }

    const actualizada = new Publicacion(
      anterior.id,
      cambios.autor ?? anterior.autor,
      cambios.titulo ?? anterior.titulo,
      cambios.contenido ?? anterior.contenido,
    );

    actualizada.activa = anterior.activa;
    actualizada.destacada = anterior.destacada;
    actualizada.etiquetas = [...anterior.etiquetas];
    actualizada.reportes = [...anterior.reportes];
    actualizada.estado = anterior.estado;

    const indice = this.publicaciones.indexOf(anterior);
    this.publicaciones[indice] = actualizada;

    await this.guardar();

    return actualizada;
  }

  // Operación CRUD: Eliminar (ahora es async)
  async eliminar(id) {
    const publicacion = this.buscarPorId(id);
    if (!publicacion) return false;

    const indice = this.publicaciones.indexOf(publicacion);
    this.publicaciones.splice(indice, 1);
    await this.guardar();
    return true;
  }

  // ==========================================
  // MÉTODOS DEL DOMINIO
  // ==========================================

  pendientesDeRevision() {
    return this.publicaciones.filter((p) => p.activa && p.requiereRevision());
  }

  buscarPorUsuario(nombreUsuario) {
    return this.publicaciones.filter((publicacion) =>
      publicacion.esDeAutor(nombreUsuario),
    );
  }

  buscarPorEtiqueta(etiqueta) {
    return this.publicaciones.filter(
      (publicacion) =>
        publicacion.activa && publicacion.tieneEtiqueta(etiqueta),
    );
  }

  obtenerEstado() {
    const activas = this.publicaciones.filter((p) => p.activa).length;
    return `Publicaciones activas: ${activas}`;
  }

  obtenerEstadoInactivas() {
    const inactivas = this.publicaciones.filter((p) => !p.activa).length;
    return `Publicaciones inactivas: ${inactivas}`;
  }

  filtrarActivas() {
    return this.publicaciones.filter((publicacion) => publicacion.estaActiva());
  }

  cantidadTotal() {
    return this.publicaciones.length;
  }

  listarResumenes() {
    return this.publicaciones.map((publicacion) =>
      publicacion.mostrarResumen(),
    );
  }

  filtrarPorClase(claseConstructor) {
    return this.publicaciones.filter(
      (publicacion) => publicacion instanceof claseConstructor,
    );
  }

  cargarDesde(datos) {
    this.publicaciones = datos.map((item) => {
      const usuario = new Usuario(item.autor.nombre, item.autor.email);
      let pub;

      if (item.tipo === "venta") {
        pub = new PublicacionVenta(
          item.id || this.proximoId++,
          usuario,
          item.titulo,
          item.descripcion,
          item.precio,
        );
      } else if (item.tipo === "servicio") {
        pub = new PublicacionServicio(
          item.id || this.proximoId++,
          usuario,
          item.titulo,
          item.descripcion,
          item.modalidad,
          item.duracion,
        );
      } else {
        pub = new Publicacion(
          item.id || this.proximoId++,
          usuario,
          item.titulo,
          item.descripcion,
        );
      }

      if (item.id && item.id >= this.proximoId) {
        this.proximoId = item.id + 1;
      }

      if (!item.activa) pub.darDeBaja();
      if (item.destacada) pub.destacar();
      return pub;
    });

    this.dispatchEvent(new CustomEvent("publicacionesCargadas"));
  }
}

export default RepositorioPublicaciones;
