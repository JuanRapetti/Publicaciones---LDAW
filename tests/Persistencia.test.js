import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import RepositorioPublicaciones from "../src/RepositorioPublicaciones.js";

const CONTENIDO_VALIDO = "Contenido de prueba para test de persistencia";

test("una segunda instancia con la misma ruta recupera lo que la primera guardó", async () => {
  const carpeta = await mkdtemp(join(tmpdir(), "publicaciones-"));
  const ruta = join(carpeta, "datos.json");

  // Instancia A guarda una publicación
  const a = new RepositorioPublicaciones(ruta);
  await a.cargar();
  await a.agregar("Ana", "Apuntes de Redes", CONTENIDO_VALIDO);

  // Instancia B se conecta al mismo archivo
  const b = new RepositorioPublicaciones(ruta);
  await b.cargar();

  expect(b.listar().length).toBe(1);
  expect(b.listar()[0].titulo).toBe("Apuntes de Redes");
});
