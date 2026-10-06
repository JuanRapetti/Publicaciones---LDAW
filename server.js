import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { RepositorioPublicaciones } from "./src/RepositorioPublicaciones.js";
import { Publicacion } from "./src/Publicacion.js";
import { paraExponer, convertirAXML } from "./src/Formatos.js";
import crearRouterPublicaciones from "./api/publicaciones.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// PASO 7 & 8D: Ruta de persistencia e instancia del repositorio
const RUTA_DATOS = path.join(__dirname, "data", "publicaciones.json");
const repositorio = new RepositorioPublicaciones(RUTA_DATOS);

// Precarga e inicialización asíncrona
await repositorio.cargar();

if (repositorio.listar().length === 0) {
  const pub1 = new Publicacion(
    1,
    "Ana",
    "Apuntes de Redes",
    "Excelente estado",
  );
  const pub2 = new Publicacion(
    2,
    "Bruno",
    "Calculadora Casio",
    "Funciona bien",
  );
  const pub3 = new Publicacion(
    3,
    "Carla",
    "Clases de Álgebra",
    "Modalidad virtual",
  );
  pub3.darDeBaja();

  await repositorio.agregar(pub1);
  await repositorio.agregar(pub2);
  await repositorio.agregar(pub3);
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// PASO 5C: Montar router bajo /publicaciones
app.use("/publicaciones", crearRouterPublicaciones(repositorio));

// PASO 4A: Endpoint GET /datos/publicaciones.json
app.get("/datos/publicaciones.json", (req, res) => {
  const publicas = repositorio.listar().map(paraExponer);
  res.json(publicas);
});

// PASO 4B: Endpoint GET /datos/publicaciones.xml
app.get("/datos/publicaciones.xml", (req, res) => {
  const xml = convertirAXML(repositorio.listar());
  res.type("application/xml").send(xml);
});

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
