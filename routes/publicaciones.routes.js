import { Router } from "express";

export default function crearRouterPublicaciones(repositorio) {
  const router = Router();

  // PASO 5A: GET /publicaciones
  router.get("/", (req, res) => {
    res.json(repositorio.listar());
  });

  // PASO 5B: POST /publicaciones
  router.post("/", async (req, res) => {
    try {
      if (!req.body) {
        return res.status(400).json({ error: "No se recibieron datos en la petición" });
      }

      // Soporta tanto 'descripcion' como 'contenido'
      const { autor, titulo, contenido, descripcion, categoria } = req.body;
      const textoDescripcion = descripcion || contenido;
      const categoriaFinal = categoria || "general";

      const nueva = await repositorio.agregar(autor, titulo, textoDescripcion, categoriaFinal);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Ejercicio adicional: PUT /publicaciones/:id
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

  // Ejercicio adicional: DELETE /publicaciones/:id
  router.delete("/:id", async (req, res) => {
    const eliminado = await repositorio.eliminar(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: "Publicación inexistente" });
    }
    res.status(200).json({ mensaje: "Publicación eliminada correctamente" });
  });

  return router;
}