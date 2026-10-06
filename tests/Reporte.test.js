import { Reporte } from "../src/Reporte.js";

describe("Reporte", () => {
  test("crea un reporte con usuario, motivo y fecha", () => {
    const reporte = new Reporte("ana", "Contenido ofensivo");
    expect(reporte.usuario).toBe("ana");
    expect(reporte.motivo).toBe("Contenido ofensivo");
    expect(reporte.fecha).toBeInstanceOf(Date);
  });

  test("un motivo vacío lanza el error esperado", () => {
    expect(() => new Reporte("ana", "   ")).toThrow("Motivo inválido");
  });
});
