const http = require("http");
const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://josthinpflores:Baki2$$+-*/@cluster1.g7y1dkf.mongodb.net/?appName=Cluster1";
const client = new MongoClient(uri);
let db; // 👈 memoria temporal

async function conectarDB() {
  await client.connect();
  db = client.db("miApp");
  console.log("Conectado a MongoDB 🔥");
}

conectarDB();

const servidor = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // 👉 cuando piden la lista GET usuario
  if (req.method === "GET" && req.url === "/usuarios") {
    db.collection("usuarios").find().toArray()
	.then(data => {
		res.setHeader("Content-Type", "application/json");
		res.write(JSON.stringify(data));
		res.end();
	});
	return;
  }
  // 👉 cuando envían un nuevo usuario POST usuario
  if (req.method === "POST" && req.url === "/usuarios") {
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
  
  res.write("Ruta no encontrada");
  res.end();
});

servidor.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});