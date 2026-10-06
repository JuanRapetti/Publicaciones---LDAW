import { Router } from "express";

export default function crearRouterPublicaciones(repositorio) {
  const router = Router();

  // PASO 5A: GET /publicaciones
  router.get("/", (req, res) => {
    res.json(repositorio.listar());
  });

  // PASO 5B: POST /publicaciones
  router.post("/", (req, res) => {
    try {
      const { autor, titulo, contenido } = req.body;
      const nueva = repositorio.agregar(autor, titulo, contenido);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Ejercicio adicional: PUT /publicaciones/:id
  router.put("/:id", (req, res) => {
    try {
      const actualizada = repositorio.actualizar(req.params.id, req.body);
      res.json(actualizada);
    } catch (error) {
      if (error.message === "Publicación inexistente") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  });

  // Ejercicio adicional: DELETE /publicaciones/:id
  router.delete("/:id", (req, res) => {
    const eliminado = repositorio.eliminar(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Publicación inexistente" });
    }
    res.status(200).json({ mensaje: "Publicación eliminada correctamente" });
  });

  return router;
}
