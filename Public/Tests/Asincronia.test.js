import { jest } from "@jest/globals";
import { Publicacion } from "../js/Publicacion.js";

describe("Publicacion.revisar", () => {
  test("aprueba la publicación cuando el servicio resuelve aprobado", async () => {
    const pub = new Publicacion(
      "Ana",
      "Título de prueba",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );
    const servicioMock = {
      evaluar: jest.fn().mockResolvedValue("aprobado"),
    };

    const estadoFinal = await pub.revisar(servicioMock);

    expect(estadoFinal).toBe("aprobada");
    expect(pub.estado).toBe("aprobada");
    expect(servicioMock.evaluar).toHaveBeenCalledWith(pub);
  });

  test("rechaza la publicación cuando el servicio resuelve rechazado", async () => {
    const pub = new Publicacion(
      "Ana",
      "Título de prueba",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );
    const servicioMock = {
      evaluar: jest.fn().mockResolvedValue("rechazado"),
    };

    const estadoFinal = await pub.revisar(servicioMock);

    expect(estadoFinal).toBe("rechazada");
    expect(pub.estado).toBe("rechazada");
  });

  test("conserva el estado pendiente si el servicio falla", async () => {
    const pub = new Publicacion(
      "Ana",
      "Título de prueba",
      "Descripción de prueba con más de veinte caracteres para validar.",
    );
    const servicioMock = {
      evaluar: jest.fn().mockRejectedValue(new Error("Error de red")),
    };

    await expect(pub.revisar(servicioMock)).rejects.toThrow("Error de red");
    expect(pub.estado).toBe("pendiente");
  });
});
