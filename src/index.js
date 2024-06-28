// Importa la instancia de la aplicación express desde el archivo "server.js"
import app from "./server.js";
// Importar la función connection()
import connection from "./database.js"; // Importa la función 'connection' desde el archivo "database.js" para establecer la conexión con la base de datos


// Haciendo uso de la función connection()
connection(); // Llama a la función 'connection' para establecer la conexión con la base de datos


// Escucha las conexiones entrantes en el puerto configurado en la aplicación express
app.listen(app.get("port"), () => {
  console.log(`Server connected to port: ${process.env.port}`); // Imprime un mensaje indicando la dirección del servidor
});


