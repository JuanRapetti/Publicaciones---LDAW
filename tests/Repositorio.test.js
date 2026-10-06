import RepositorioPublicaciones from "../src/RepositorioPublicaciones.js";
import Publicacion from "../src/Publicacion.js";
import PublicacionVenta from "../src/PublicacionVenta.js";
import PublicacionServicio from "../src/PublicacionServicio.js";
import Usuario from "../src/Usuario.js";

describe("RepositorioPublicaciones CRUD", () => {
  let repositorio;
  let usuario;

  beforeEach(() => {
    repositorio = new RepositorioPublicaciones();
    usuario = new Usuario("Ana", "ana@mail.com");
  });

  // PASO 6A
  test("agregar asigna ids crecientes a partir de 1", () => {
    const p1 = repositorio.agregar("Juan", "Título 1", "Contenido 1");
    const p2 = repositorio.agregar("Pedro", "Título 2", "Contenido 2");

    expect(p1.id).toBe(1);
    expect(p2.id).toBe(2);
  });

  // PASO 6B
  test("listar devuelve una copia: modificarla no afecta al repositorio", () => {
    repositorio.agregar("Juan", "Título 1", "Contenido 1");
    const copia = repositorio.listar();

    copia.pop(); // Quitar un elemento de la copia

    expect(copia.length).toBe(0);
    expect(repositorio.listar().length).toBe(1);
  });

  // PASO 6C / Búsqueda por string
  test("buscarPorId funciona con id como string", () => {
    const p = repositorio.agregar("Juan", "Título", "Contenido");
    const encontrada = repositorio.buscarPorId(String(p.id));

    expect(encontrada).not.toBeNull();
    expect(encontrada.id).toBe(p.id);
  });

  // PASO 6D
  test("eliminar una publicación inexistente devuelve false", () => {
    const resultado = repositorio.eliminar(999);
    expect(resultado).toBe(false);
  });

  // Test de reportes acumulados antes de actualizar
  test("actualizar conserva los reportes y estado acumulados antes de editar", () => {
    const p = repositorio.agregar("Juan", "Título Original", "Contenido");
    p.reportar("usuario1", "Spam");

    const actualizada = repositorio.actualizar(p.id, {
      titulo: "Título Editado",
    });

    expect(actualizada.titulo).toBe("Título Editado");
    expect(actualizada.reportes.length).toBe(1);
    expect(actualizada.reportes[0].motivo).toBe("Spam");
  });

  test("buscarPorEtiqueta devuelve coincidencias activas", () => {
    const publicacion = new Publicacion(1, usuario, "Apuntes de Redes", "...");
    publicacion.agregarEtiqueta("redes");
    repositorio.agregar(publicacion);

    expect(repositorio.buscarPorEtiqueta("redes")).toEqual([publicacion]);
  });
});
