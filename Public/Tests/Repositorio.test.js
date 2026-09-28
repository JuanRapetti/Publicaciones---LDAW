import { RepositorioPublicaciones } from "../js/RepositorioPublicaciones.js";
import { Publicacion } from "../js/Publicacion.js";
import PublicacionVenta from "../js/PublicacionVenta.js";

describe("RepositorioPublicaciones", () => {
  test("buscarPorEtiqueta devuelve coincidencias activas", () => {
    const repo = new RepositorioPublicaciones();
    const pub1 = new Publicacion(
      "Ana",
      "Título de prueba 1",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );
    pub1.agregarEtiqueta("Redes");

    repo.agregar(pub1);

    expect(repo.buscarPorEtiqueta("redes")).toEqual([pub1]);
  });

  test("una publicación dada de baja queda excluida", () => {
    const repo = new RepositorioPublicaciones();
    const pub1 = new Publicacion(
      "Ana",
      "Título de prueba 1",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );
    pub1.agregarEtiqueta("Redes");
    pub1.darDeBaja();

    repo.agregar(pub1);

    expect(repo.buscarPorEtiqueta("redes")).toEqual([]);
  });

  test("cada subclase arma su propio resumen", () => {
    // Orden según PublicacionVenta(titulo, descripcion, autor, precio, categoria):
    const pubVenta = new PublicacionVenta(
      "Apuntes de Redes",
      "Descripción de prueba con más de veinte caracteres para validar.",
      "Ana",
      1500,
      "compraventa",
    );

    expect(pubVenta.mostrarResumen()).toContain("Apuntes de Redes");
    expect(pubVenta.mostrarResumen()).toContain("1500");
  });
});
