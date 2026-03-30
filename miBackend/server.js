const http = require("http");
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db; // 👈 memoria temporal

async function conectarDB() {
  await client.connect();
  db = client.db("miApp");
  console.log("Conectado a MongoDB 🔥");
}

conectarDB();

const servidor = http.createServer((req, res) => {
  console.log("URL recibida:", req.url);
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  //Ignorar favicon primero
  if (req.url === "/favicon.ico") {
  res.end();
  return;
  }
  //Preguntar por OPTIONS
  if (req.method === "OPTIONS") {
  res.writeHead(204);
  res.end();
  return;
  }
  // 🟢 Ruta raíz
  if (req.method === "GET" && req.url === "/") {
    res.write("API funcionando 🔥");
    res.end();
    return;
  }
  // 👉 cuando piden la lista GET usuario
  if (req.method === "GET" && req.url.startsWith("/usuarios")) {
    db.collection("usuarios").find().toArray()
	.then(data => {
		res.setHeader("Content-Type", "application/json");
		res.write(JSON.stringify(data));
		res.end();
	});
	return;
  }
  
  // 👉 cuando envían un nuevo usuario POST usuario
  if (req.method === "POST" && req.url.startsWith("/usuarios")) {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      const nuevoUsuario = JSON.parse(body);

      db.collection("usuarios").insertOne({
		  nombre: nuevoUsuario.nombre
	  }).then(() => {
		  res.write("Usuario Guardado 🔥");
		  res.end();
	  });
    });
	return;
  }
  
  //Deletear usuarios
  if (req.method === "DELETE" && req.url.startsWith("/usuarios/")) {

  const id = req.url.split("/")[2]; // 👈 sacamos el ID

  const { ObjectId } = require("mongodb");

  db.collection("usuarios").deleteOne({ _id: new ObjectId(id) })
    .then(() => {
      res.write("Usuario eliminado 🔥");
      res.end();
    });

  return;
  }
  
  res.write("Ruta no encontrada");
  res.end();
});

const PORT = process.env.PORT || 3000;

servidor.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en http://192.168.x.x:3000/usuarios");
});