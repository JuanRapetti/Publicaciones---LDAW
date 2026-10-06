import { RepositorioPublicaciones } from "../src/RepositorioPublicaciones.js";

describe("RepositorioPublicaciones CRUD", () => {
  let repositorio;

  beforeEach(async () => {
    // Si usas una ruta de archivo para los tests, pásala aquí o crea la instancia vacía
    repositorio = new RepositorioPublicaciones();
    if (typeof repositorio.cargar === "function") {
      await repositorio.cargar();
    }
  });

  test("agregar asigna ids crecientes a partir de 1", async () => {
    const p1 = await repositorio.agregar("Pedro", "Título 1", "Contenido 1");
    const p2 = await repositorio.agregar("Pedro", "Título 2", "Contenido 2");

    expect(p1.id).toBe(1);
    expect(p2.id).toBe(2);
  });

  test("buscarPorId funciona con id como string", async () => {
    const p = await repositorio.agregar("Juan", "Título", "Contenido");
    const encontrada = repositorio.buscarPorId(String(p.id));

    expect(encontrada).not.toBeNull();
    expect(encontrada.id).toBe(p.id);
  });

  test("eliminar una publicación inexistente devuelve false", async () => {
    const resultado = await repositorio.eliminar(999);
    expect(resultado).toBe(false);
  });

  test("actualizar conserva los reportes y estado acumulados antes de editar", async () => {
    const p = await repositorio.agregar("Juan", "Título Original", "Contenido");
    p.reportar("usuario1", "Spam");

    const actualizada = await repositorio.actualizar(p.id, {
      titulo: "Título Editado",
    });

    expect(actualizada.titulo).toBe("Título Editado");
    expect(actualizada.reportes).toHaveLength(1);
  });
});
