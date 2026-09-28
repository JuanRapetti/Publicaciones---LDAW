import { Publicacion, CATEGORIAS_PERMITIDAS } from "../js/Publicacion.js";

describe("Publicacion - Validaciones y Normalización", () => {
  test("crea una publicación válida y normaliza espacios en los bordes", () => {
    const pub = new Publicacion(
      "  Ana  ",
      "  Apuntes de Redes  ",
      "  Esta es una descripción válida con más de veinte caracteres.  ",
      "general",
    );
    expect(pub.autor).toBe("Ana");
    expect(pub.titulo).toBe("Apuntes de Redes");
    expect(pub.descripcion).toBe(
      "Esta es una descripción válida con más de veinte caracteres.",
    );
  });

  test.each([
    ["1234", "corto (4 caracteres)"],
    ["a".repeat(81), "largo (81 caracteres)"],
  ])("un título %s (%s) lanza el error esperado", (titulo) => {
    expect(
      () =>
        new Publicacion(
          "Ana",
          titulo,
          "Contenido válido de más de veinte caracteres.",
        ),
    ).toThrow("El título debe tener entre 5 y 80 caracteres");
  });

  test("un autor vacío o con puros espacios lanza error", () => {
    expect(
      () =>
        new Publicacion(
          "   ",
          "Título Válido",
          "Contenido válido de más de veinte caracteres.",
        ),
    ).toThrow("El autor es obligatorio");
  });

  test("una categoría no permitida lanza error", () => {
    expect(
      () =>
        new Publicacion(
          "Ana",
          "Título Válido",
          "Contenido válido de más de veinte caracteres.",
          "inventada",
        ),
    ).toThrow(
      `La categoría debe ser una de: ${CATEGORIAS_PERMITIDAS.join(", ")}`,
    );
  });
});
