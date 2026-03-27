const http = require("http");

const servidor = http.createServer((req, res) => {
  res.write("Hola desde el servidor 🔥");
  res.end();
});

servidor.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});