import { Publicacion } from "../js/Publicacion.js";
import { RepositorioPublicaciones } from "../js/RepositorioPublicaciones.js";

describe("Publicacion reportes", () => {
  test("una publicación nueva no requiere revisión", () => {
    const pub = new Publicacion(
      "Ana",
      "Título de prueba",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );
    expect(pub.requiereRevision()).toBe(false);
  });

  test("con un solo reporte no alcanza el límite", () => {
    const pub = new Publicacion(
      "Ana",
      "Título de prueba",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );
    pub.reportar("Juan", "Spam");
    expect(pub.requiereRevision()).toBe(false);
  });

  test("un usuario no puede reportar dos veces la misma publicación", () => {
    const pub = new Publicacion(
      "Ana",
      "Título de prueba",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );
    pub.reportar("Juan", "Spam");
    expect(() => pub.reportar("Juan", "Contenido inapropiado")).toThrow(
      "El usuario ya reportó esta publicación",
    );
  });

  test("con tres reportes de usuarios distintos requiere revisión", () => {
    const pub = new Publicacion(
      "Ana",
      "Título de prueba",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );
    pub.reportar("Juan", "Spam");
    pub.reportar("Pedro", "Ofensivo");
    pub.reportar("Maria", "Falso");
    expect(pub.requiereRevision()).toBe(true);
  });
});

describe("RepositorioPublicaciones pendientesDeRevision", () => {
  test("devuelve sólo publicaciones activas que requieren revisión", () => {
    const repo = new RepositorioPublicaciones();
    const pub1 = new Publicacion(
      "Ana",
      "Título de prueba 1",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );
    const pub2 = new Publicacion(
      "Bruno",
      "Título de prueba 2",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );

    pub1.reportar("U1", "Motivo");
    pub1.reportar("U2", "Motivo");
    pub1.reportar("U3", "Motivo");

    repo.agregar(pub1);
    repo.agregar(pub2);

    expect(repo.pendientesDeRevision()).toEqual([pub1]);
  });

  test("una publicación dada de baja queda excluida aunque requiera revisión", () => {
    const repo = new RepositorioPublicaciones();
    const pub = new Publicacion(
      "Ana",
      "Título de prueba",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );

    pub.reportar("U1", "Motivo");
    pub.reportar("U2", "Motivo");
    pub.reportar("U3", "Motivo");
    pub.darDeBaja();

    repo.agregar(pub);

    expect(repo.pendientesDeRevision()).toEqual([]);
  });

  test("sin reportes suficientes no hay publicaciones pendientes", () => {
    const repo = new RepositorioPublicaciones();
    const pub = new Publicacion(
      "Ana",
      "Título de prueba",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );

    repo.agregar(pub);

    expect(repo.pendientesDeRevision()).toEqual([]);
  });
});
