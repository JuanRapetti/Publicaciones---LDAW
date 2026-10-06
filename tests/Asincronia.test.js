import { Publicacion } from "../src/Publicacion.js";

describe("Publicacion.revisar", () => {
  test("aprueba la publicación cuando el servicio resuelve aprobado", async () => {
    const servicio = { evaluar: async () => "aprobado" };
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    await expect(publicacion.revisar(servicio)).resolves.toBe("aprobada");
    expect(publicacion.estado).toBe("aprobada");
  });

  test("rechaza la publicación cuando el servicio resuelve rechazado", async () => {
    const servicio = { evaluar: async () => "rechazado" };
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    await expect(publicacion.revisar(servicio)).resolves.toBe("rechazada");
    expect(publicacion.estado).toBe("rechazada");
  });

  test("conserva el estado pendiente si el servicio falla", async () => {
    const servicio = {
      evaluar: async () => {
        throw new Error("Servicio no disponible");
      },
    };
    const publicacion = new Publicacion("Ana", "Apuntes de Redes", "...");
    await expect(publicacion.revisar(servicio)).rejects.toThrow(
      "Servicio no disponible",
    );
    expect(publicacion.estado).toBe("pendiente");
  });
});
