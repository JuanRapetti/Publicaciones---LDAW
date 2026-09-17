import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Servir archivos estáticos desde la carpeta 'Public'
app.use(express.static(path.join(__dirname, "Public")));

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

// publicaciones test
const publicaciones = [
  {
    id: 1,
    titulo: "Libro de Algoritmos y Estructuras de Datos",
    descripcion: "Excelente estado, ideal para la cursada de algoritmos.",
    tipo: "venta",
    precio: 15000,
    activa: true,
    destacada: true,
    autor: {
      nombre: "Ana García",
      email: "ana.garcia@estudiantes.edu.ar",
    },
  },
  {
    id: 2,
    titulo: "Clases particulares de Análisis Matemático I",
    descripcion: "Repaso de parciales y finales de forma práctica.",
    tipo: "servicio",
    modalidad: "virtual",
    duracion: 60,
    activa: true,
    destacada: false,
    autor: {
      nombre: "Carlos López",
      email: "carlos.lopez@estudiantes.edu.ar",
    },
  },
  {
    id: 3,
    titulo: "Calculadora Científica Casio FX-95",
    descripcion: "Usada en buen estado, funciona con pila nueva.",
    tipo: "venta",
    precio: 22000,
    activa: false,
    destacada: false,
    autor: {
      nombre: "María Pérez",
      email: "maria.perez@estudiantes.edu.ar",
    },
  },
];

// Endpoint /api/publicaciones
app.get("/api/publicaciones", (req, res) => {
  // Simular retraso de red (opcional)
  setTimeout(() => {
    // Si la URL incluye ?error=1, simula un fallo en el servidor
    if (req.query.error === "1") {
      return res
        .status(500)
        .json({ error: "Error interno del servidor simulado." });
    }

    res.json(publicaciones);
  }, 500);
});
