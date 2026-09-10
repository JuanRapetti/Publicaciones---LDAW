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
