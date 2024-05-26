// Importa la instancia de la aplicación express desde el archivo "server.js"
import app from "./server.js";
import http from "http"; // Importa el módulo 'http' para crear el servidor HTTP
import { Server } from "socket.io"; // Importa la clase 'Server' de socket.io para crear el servidor de WebSockets
import ordenesRoutes from './routers/ordentrabajo_routes.js';

// Importar la función connection()
import connection from "./database.js"; // Importa la función 'connection' desde el archivo "database.js" para establecer la conexión con la base de datos

// Haciendo uso de la función connection()
connection(); // Llama a la función 'connection' para establecer la conexión con la base de datos

const server = http.createServer(app); // Crea un servidor HTTP utilizando la instancia de la aplicación express

const io = new Server(server, { // Crea una instancia del servidor de WebSockets y lo adjunta al servidor HTTP
  cors: {
    origin: "http://localhost:3000", // Configura las opciones de cors permitiendo solicitudes solo desde "http://localhost:5173"
  },
});

// Usar las rutas de órdenes de trabajo
app.use('/api', ordenesRoutes);

// Usar las rutas de ordenes de trabajo
app.use('/api', ordenesRoutes);

// Escucha las conexiones entrantes en el puerto configurado en la aplicación express
app.listen(app.get("port"), () => {
  console.log(`https://tesistest.netlify.app`); // Imprime un mensaje indicando la dirección del servidor
});
