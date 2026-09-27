import RepositorioPublicaciones from "../js/RepositorioPublicaciones.js";
import Publicacion from "../js/Publicacion.js";
import PublicacionVenta from "../js/PublicacionVenta.js";
import PublicacionServicio from "../js/PublicacionServicio.js";
import Usuario from "../js/Usuario.js";

describe("RepositorioPublicaciones", () => {
  let repositorio;
  let usuario;

  beforeEach(() => {
    repositorio = new RepositorioPublicaciones();
    usuario = new Usuario("Ana", "ana@mail.com");
  });

  test("buscarPorEtiqueta devuelve coincidencias activas", () => {
    const publicacion = new Publicacion("Apuntes de Redes", "...", usuario);
    publicacion.agregarEtiqueta("redes");
    repositorio.agregar(publicacion);

    expect(repositorio.buscarPorEtiqueta("redes")).toEqual([publicacion]);
  });

  test("una publicación dada de baja queda excluida", () => {
    const publicacion = new Publicacion("Apuntes de Redes", "...", usuario);
    publicacion.agregarEtiqueta("redes");
    publicacion.darDeBaja();
    repositorio.agregar(publicacion);

    expect(repositorio.buscarPorEtiqueta("redes")).toEqual([]);
  });

  test("una etiqueta inexistente devuelve un arreglo vacío", () => {
    expect(repositorio.buscarPorEtiqueta("inexistente")).toEqual([]);
  });

  test("cada subclase arma su propio resumen", () => {
    const venta = new PublicacionVenta("Calculadora", "...", usuario, 5000);
    const servicio = new PublicacionServicio(
      "Clases de Algebra",
      "...",
      usuario,
      "virtual",
      60,
    );

    expect(venta.mostrarResumen()).toContain("5000");
    expect(servicio.mostrarResumen()).toContain("Clases de Algebra");
  });
});
