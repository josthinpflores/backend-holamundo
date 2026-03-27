const http = require("http");
let usuarios = ["Juan", "María", "Pedro"]; // 👈 memoria temporal

const servidor = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // 👉 cuando piden la lista
  if (req.method === "GET" && req.url === "/usuarios") {
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(usuarios));
    return res.end();
  }
  // 👉 cuando envían un nuevo usuario
  if (req.method === "POST" && req.url === "/usuarios") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      const nuevoUsuario = JSON.parse(body);

      usuarios.push(nuevoUsuario.nombre);

      res.write("Usuario agregado 🔥");
      res.end();
    });
	return;
  }
  res.write("Ruta no encontrada");
  res.end();
});

servidor.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});