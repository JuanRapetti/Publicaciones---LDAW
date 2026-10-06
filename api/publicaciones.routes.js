import { Router } from "express";

export default function crearRouterPublicaciones(repositorio) {
  const router = Router();

  // PASO 5A: GET /publicaciones
  router.get("/", (req, res) => {
    res.json(repositorio.listar());
  });

  // PASO 5B: POST /publicaciones (async por guardar en disco)
  router.post("/", async (req, res) => {
    try {
      const { autor, titulo, contenido } = req.body;
      const nueva = await repositorio.agregar(autor, titulo, contenido);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Ejercicio adicional: PUT /publicaciones/:id (async)
  router.put("/:id", async (req, res) => {
    try {
      const actualizada = await repositorio.actualizar(req.params.id, req.body);
      res.json(actualizada);
    } catch (error) {
      if (error.message === "Publicación inexistente") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  });

  // Ejercicio adicional: DELETE /publicaciones/:id (async)
  router.delete("/:id", async (req, res) => {
    const eliminado = await repositorio.eliminar(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Publicación inexistente" });
    }
    res.status(200).json({ mensaje: "Publicación eliminada correctamente" });
  });

  return router;
}
