const http = require("http");

const servidor = http.createServer((req, res) => {
  res.write("Hola desde el servidor 🔥\n");
  if (req.url === "/") {
    res.write("Inicio");
  } else if (req.url === "/usuarios") {
    res.write("Lista de usuarios 👀");
  } else {
    res.write("No encontrado");
  }
  res.end();
});

servidor.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});