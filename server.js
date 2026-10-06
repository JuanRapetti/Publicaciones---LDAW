import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { RepositorioPublicaciones } from "./src/RepositorioPublicaciones.js";
import { Publicacion } from "./src/Publicacion.js";
import crearRouterPublicaciones from "./api/publicaciones.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Instancia única del repositorio
const repositorio = new RepositorioPublicaciones();

// Precarga inicial
const pub1 = new Publicacion(1, "Ana", "Apuntes de Redes", "Excelente estado");
const pub2 = new Publicacion(2, "Bruno", "Calculadora Casio", "Funciona bien");
const pub3 = new Publicacion(
  3,
  "Carla",
  "Clases de Álgebra",
  "Modalidad virtual",
);
pub3.darDeBaja();

repositorio.agregar(pub1);
repositorio.agregar(pub2);
repositorio.agregar(pub3);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// PASO 5C: Montar router bajo /publicaciones
app.use("/publicaciones", crearRouterPublicaciones(repositorio));

// Compatibilidad con endpoint anterior /api/publicaciones
app.get("/api/publicaciones", (req, res) => {
  if (req.query.error === "1") {
    return res.status(500).json({ error: "Error de servidor provocado" });
  }
  res.json(repositorio.listar());
});

// Rutas de estado
app.get("/estado-comunidad", (req, res) => {
  res.send(repositorio.obtenerEstado());
});

app.get("/estado-inactivas", (req, res) => {
  res.send(repositorio.obtenerEstadoInactivas());
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
