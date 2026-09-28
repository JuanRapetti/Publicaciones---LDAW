import { Publicacion } from "../js/Publicacion.js";
import { RepositorioPublicaciones } from "../js/RepositorioPublicaciones.js";

describe("Publicacion reportes", () => {
  test("una publicación nueva no requiere revisión", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    expect(publicacion.requiereRevision()).toBe(false);
  });

  test("con un solo reporte no alcanza el límite", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.reportar("bruno", "Contenido repetido");
    expect(publicacion.requiereRevision()).toBe(false);
  });

  test("un usuario no puede reportar dos veces la misma publicación", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.reportar("bruno", "Contenido repetido");
    expect(() => publicacion.reportar("bruno", "Otro motivo")).toThrow(
      "El usuario ya reportó esta publicación",
    );
  });

  test("con tres reportes de usuarios distintos requiere revisión", () => {
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.reportar("bruno", "motivo 1");
    publicacion.reportar("carla", "motivo 2");
    publicacion.reportar("dario", "motivo 3");
    expect(publicacion.requiereRevision()).toBe(true);
  });
});

describe("RepositorioPublicaciones pendientesDeRevision", () => {
  test("devuelve sólo publicaciones activas que requieren revisión", () => {
    const repositorio = new RepositorioPublicaciones();
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.reportar("bruno", "motivo 1");
    publicacion.reportar("carla", "motivo 2");
    publicacion.reportar("dario", "motivo 3");
    repositorio.agregar(publicacion);
    expect(repositorio.pendientesDeRevision()).toEqual([publicacion]);
  });

  test("una publicación dada de baja queda excluida aunque requiera revisión", () => {
    const repositorio = new RepositorioPublicaciones();
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.reportar("bruno", "motivo 1");
    publicacion.reportar("carla", "motivo 2");
    publicacion.reportar("dario", "motivo 3");
    publicacion.darDeBaja();
    repositorio.agregar(publicacion);
    expect(repositorio.pendientesDeRevision()).toEqual([]);
  });

  test("sin reportes suficientes no hay publicaciones pendientes", () => {
    const repositorio = new RepositorioPublicaciones();
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    publicacion.reportar("bruno", "motivo 1");
    repositorio.agregar(publicacion);
    expect(repositorio.pendientesDeRevision()).toEqual([]);
  });
});
