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

// CAMBIADO: contenidos de al menos 20 caracteres para cumplir las reglas del dominio
const pub1 = new Publicacion(
  "Ana",
  "Apuntes de Redes",
  "Apuntes completos de la materia, en excelente estado.",
);
const pub2 = new Publicacion(
  "Bruno",
  "Calculadora Casio",
  "Calculadora científica que funciona muy bien, con pilas nuevas.",
);
const pub3 = new Publicacion(
  "Carla",
  "Clases de Álgebra",
  "Clases particulares de álgebra con modalidad virtual.",
);

pub2. id = pub1.id + 1; // Forzar ID consecutivo para pruebas
pub3.id = pub1.id + 2; // Forzar ID consecutivo para pruebas
pub3.darDeBaja(); // Desactivada para probar filtrado

repositorio.agregar(pub1);
repositorio.agregar(pub2);
repositorio.agregar(pub3);

// 1. Servir archivos estáticos del cliente usando ruta absoluta
app.use(express.static(path.join(__dirname, "Public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // NUEVO: debe ir antes de las rutas

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

// ==========================================
// RUTAS DEL TP16
// ==========================================

// NUEVO: alta de publicaciones. La ruta coordina; el dominio decide si los datos son válidos.
app.post("/publicaciones", (req, res) => {
  try {
    // El formulario envía "descripcion"; el dominio lo llama "contenido".
    const publicacion = new Publicacion(
      req.body.autor,
      req.body.titulo,
      req.body.descripcion,
      req.body.categoria,
    );
    repositorio.agregar(publicacion);
    res.status(201).send(publicacion.mostrarResumen());
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});