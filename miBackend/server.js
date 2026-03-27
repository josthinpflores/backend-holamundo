const http = require("http");

const servidor = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.url === "/") {
    res.write("Inicio");
  } else if (req.url === "/usuarios") {
    const usuarios = ["Juan", "María", "Pedro"];
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(usuarios));
  } else {
    res.write("No encontrado");
  }
  res.end();
});

servidor.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});