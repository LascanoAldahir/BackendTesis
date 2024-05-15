// Requerir los módulos
import express from 'express'; // Importa el módulo 'express' para crear y configurar el servidor
import dotenv from 'dotenv'; // Importa el módulo 'dotenv' para cargar variables de entorno desde un archivo '.env'
import cors from 'cors'; // Importa el módulo 'cors' para permitir solicitudes de diferentes orígenes en el servidor

// Importar la variable routerTecnicos
import routerTecnicos from './routers/tecnico_routes.js'; // Importa el enrutador definido para las rutas relacionadas con tecnicos
// Importar la variable routerPacientes
import routerClientes from './routers/cliente_routes.js'; // Importa el enrutador definido para las rutas relacionadas con clientes
// Importar la variable routerTratamientos
import routerEquipos from './routers/equipo_routes.js'; // Importa el enrutador definido para las rutas relacionadas con equipos

// Inicializaciones
const app = express(); // Crea una instancia de la aplicación express
dotenv.config(); // Configura dotenv para cargar las variables de entorno desde el archivo .env

// Configuraciones 
app.set('port', process.env.port || 3000); // Configura el puerto en el que se ejecutará el servidor, tomando el valor de una variable de entorno 'port' si está definida, de lo contrario usa el puerto 3000
app.use(cors()); // Usa el middleware cors para permitir solicitudes de diferentes orígenes en el servidor

// Middlewares 
app.use(express.json()); // Usa el middleware integrado de express para analizar las solicitudes entrantes con formato JSON

// Rutas 
app.use('/api', routerTecnicos); // Usa el enrutador de veterinarios en la ruta '/api'
app.use('/api', routerClientes); // Usa el enrutador de pacientes en la ruta '/api'
app.use('/api', routerEquipos); // Usa el enrutador de tratamientos en la ruta '/api'

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404")); // Maneja las solicitudes a rutas no encontradas y responde con un mensaje de error 404

// Exportar la instancia de express por medio de app
export default app; // Exporta la instancia de la aplicación express para que pueda ser utilizada en otros archivos del proyecto