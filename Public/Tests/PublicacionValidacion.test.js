import { Publicacion, CATEGORIAS_PERMITIDAS } from "../js/Publicacion.js";
import PublicacionVenta from "../js/PublicacionVenta.js";
import Usuario from "../js/Usuario.js";

const AUTOR = "Ana";
const TITULO = "Título válido";
const CONTENIDO = "Contenido válido de más de veinte caracteres.";

describe("caso válido", () => {
  test("crea la publicación con los datos correctos", () => {
    const p = new Publicacion(AUTOR, TITULO, CONTENIDO, "aviso");
    expect(p.autor).toBe(AUTOR);
    expect(p.titulo).toBe(TITULO);
    expect(p.contenido).toBe(CONTENIDO);
    expect(p.categoria).toBe("aviso");
    expect(p.activa).toBe(true);
  });

  test("la categoría por defecto es general", () => {
    expect(new Publicacion(AUTOR, TITULO, CONTENIDO).categoria).toBe("general");
  });

  test.each(CATEGORIAS_PERMITIDAS)("acepta la categoría %s", (categoria) => {
    expect(() => new Publicacion(AUTOR, TITULO, CONTENIDO, categoria)).not.toThrow();
  });

  test("acepta un objeto Usuario como autor", () => {
    const usuario = new Usuario("Ana", "ana@mail.com");
    expect(new Publicacion(usuario, TITULO, CONTENIDO).autor).toBe(usuario);
  });

  test("las subclases heredan la validación", () => {
    const usuario = new Usuario("Ana", "ana@mail.com");
    expect(() => new PublicacionVenta("1234", CONTENIDO, usuario, 100)).toThrow(
      "El título debe tener entre 5 y 80 caracteres",
    );
  });
});

describe("normalización de espacios", () => {
  test("recorta autor, título y contenido", () => {
    const p = new Publicacion("  Ana  ", "   Título válido  ", `   ${CONTENIDO}   `);
    expect(p.autor).toBe("Ana");
    expect(p.titulo).toBe("Título válido");
    expect(p.contenido).toBe(CONTENIDO);
  });

  test("los espacios no cuentan para el largo mínimo del título", () => {
    expect(() => new Publicacion(AUTOR, "  1234  ", CONTENIDO)).toThrow(
      "El título debe tener entre 5 y 80 caracteres",
    );
  });
});

describe("autor", () => {
  test.each([
    ["vacío", ""],
    ["solo espacios", "   "],
    ["undefined", undefined],
  ])("un autor %s lanza error", (_, autor) => {
    expect(() => new Publicacion(autor, TITULO, CONTENIDO)).toThrow(
      "El autor es obligatorio",
    );
  });
});

describe("límites del título (5–80)", () => {
  test.each([
    ["4 caracteres", "a".repeat(4)],
    ["81 caracteres", "a".repeat(81)],
  ])("título de %s lanza error", (_, titulo) => {
    expect(() => new Publicacion(AUTOR, titulo, CONTENIDO)).toThrow(
      "El título debe tener entre 5 y 80 caracteres",
    );
  });

  test.each([
    ["5 caracteres", "a".repeat(5)],
    ["80 caracteres", "a".repeat(80)],
  ])("título de %s es válido", (_, titulo) => {
    expect(() => new Publicacion(AUTOR, titulo, CONTENIDO)).not.toThrow();
  });
});

describe("límites del contenido (20–500)", () => {
  test.each([
    ["19 caracteres", "a".repeat(19)],
    ["501 caracteres", "a".repeat(501)],
  ])("contenido de %s lanza error", (_, contenido) => {
    expect(() => new Publicacion(AUTOR, TITULO, contenido)).toThrow(
      "La descripcion debe tener entre 20 y 500 caracteres",
    );
  });

  test.each([
    ["20 caracteres", "a".repeat(20)],
    ["500 caracteres", "a".repeat(500)],
  ])("contenido de %s es válido", (_, contenido) => {
    expect(() => new Publicacion(AUTOR, TITULO, contenido)).not.toThrow();
  });
});

describe("categoría", () => {
  test("una categoría inventada lanza error", () => {
    expect(() => new Publicacion(AUTOR, TITULO, CONTENIDO, "inventada")).toThrow(
      "La categoría debe ser una de:",
    );
  });
});