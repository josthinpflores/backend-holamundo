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
const servidor = http.createServer((req, res) => {
  console.log("URL recibida:", req.url);
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "GET" && req.url === "/") { //Ruta Raiz
    res.write("API funcionando 🔥");
    res.end();
    return;
  }
  if (req.method === "GET" && req.url.startsWith("/usuarios")) { // 👉 cuando piden la lista GET usuario
    db.collection("usuarios").find().toArray()
	.then(data => {
		res.setHeader("Content-Type", "application/json");
		res.write(JSON.stringify(data));
		res.end();
	});
	return;
  }
  if (req.method === "POST" && req.url.startsWith("/usuarios")) { // 👉 cuando envían un nuevo usuario POST usuario
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
  if (req.method === "DELETE" && req.url.startsWith("/usuarios/")) { //Deletear usuarios
  const id = req.url.split("/")[2].trim();
  console.log("ID recibido", id);
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
conectarDB().then(() => {
  servidor.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor corriendo 🔥");
  });
});