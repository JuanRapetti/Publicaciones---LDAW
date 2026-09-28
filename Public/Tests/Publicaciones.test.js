import Publicacion from "../js/Publicacion.js";
import Usuario from "../js/Usuario.js";

const TITULO = "Apuntes de Redes";
const CONTENIDO = "Contenido válido de más de veinte caracteres.";

describe("Publicacion", () => {
  let autorPrueba;
  let publicacion;

  beforeEach(() => {
    autorPrueba = new Usuario("Ana", "ana@mail.com");
    // Orden de la clase base: (autor, titulo, contenido)
    publicacion = new Publicacion(autorPrueba, TITULO, CONTENIDO);
  });

  test("una publicación nueva comienza activa y sin etiquetas", () => {
    expect(publicacion.activa).toBe(true);
    expect(publicacion.etiquetas).toEqual([]);
  });

  test("agregarEtiqueta incorpora una etiqueta normalizada", () => {
    publicacion.agregarEtiqueta(" redes ");
    expect(publicacion.etiquetas).toEqual(["redes"]);
  });

  test("darDeBaja cambia activa a false", () => {
    publicacion.darDeBaja();
    expect(publicacion.activa).toBe(false);
  });

  test("una etiqueta repetida no se agrega dos veces", () => {
    publicacion.agregarEtiqueta("redes");
    publicacion.agregarEtiqueta("redes");
    expect(publicacion.etiquetas).toEqual(["redes"]);
  });

  test("una etiqueta vacía lanza el error esperado", () => {
    expect(() => publicacion.agregarEtiqueta("   ")).toThrow("Etiqueta inválida");
  });

  test("tieneEtiqueta ignora mayúsculas y minúsculas", () => {
    publicacion.agregarEtiqueta("Redes");
    expect(publicacion.tieneEtiqueta("redes")).toBe(true);
  });
});