import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { RepositorioPublicaciones } from "./Public/js/RepositorioPublicaciones.js";
import { Publicacion } from "./Public/js/Publicacion.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Instancia única del repositorio en el servidor
const repositorio = new RepositorioPublicaciones();

// Precarga de datos ficticios de prueba
const pub1 = new Publicacion("Ana", "Apuntes de Redes", "Excelente estado");
const pub2 = new Publicacion("Bruno", "Calculadora Casio", "Funciona bien");
const pub3 = new Publicacion("Carla", "Clases de Álgebra", "Modalidad virtual");
pub3.darDeBaja(); // Desactivada para probar filtrado

repositorio.agregar(pub1);
repositorio.agregar(pub2);
repositorio.agregar(pub3);

// 1. Servir archivos estáticos del cliente usando ruta absoluta
app.use(express.static(path.join(__dirname, "Public")));
app.use(express.json());

// ==========================================
// RUTAS DE LA API (Fix para el error 404)
// ==========================================

// Endpoint consultado por cargarPublicaciones() en main.js
app.get("/api/publicaciones", (req, res) => {
  // Manejo de la query ?error=1 enviada por el botón "Forzar error"
  if (req.query.error === "1") {
    return res.status(500).json({ error: "Error de servidor provocado" });
  }

  // Manejo de la carga normal para el botón "Actualizar"
  const lista = repositorio.obtenerTodas
    ? repositorio.obtenerTodas()
    : repositorio.listar();

  res.json(lista);
});

// ==========================================
// RUTAS DEL TP15
// ==========================================

app.get("/estado-comunidad", (req, res) => {
  res.send(repositorio.obtenerEstado());
});

app.get("/estado-inactivas", (req, res) => {
  res.send(repositorio.obtenerEstadoInactivas());
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
