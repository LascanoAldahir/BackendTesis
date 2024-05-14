import { Router } from 'express';
const router = Router();

// Importar controladores de clientes
import {
    actualizarCliente,
    detalleCliente,
    eliminarCliente,
    listarClientes,
    registrarCliente,
    loginCliente,
    perfilCliente 
} from "../controllers/cliente_controller.js";

// Importar middleware de autenticación
import verificarAutenticacion from "../middlewares/autenticacion.js";

// Rutas para el manejo de pacientes
router.post('/cliente/login', loginCliente); // Ruta para iniciar sesión de pacientes

router.get('/cliente/perfil', verificarAutenticacion, perfilCliente); // Ruta para obtener el perfil del paciente
router.get("/clientes", verificarAutenticacion, listarClientes); // Ruta para listar todos los pacientes
router.get("/cliente/:id", verificarAutenticacion, detalleCliente); // Ruta para obtener detalles de un paciente específico
router.post("/cliente/registro", verificarAutenticacion, registrarCliente); // Ruta para registrar un nuevo paciente
router.put("/cliente/actualizar/:id", verificarAutenticacion, actualizarCliente); // Ruta para actualizar los datos de un paciente
router.delete("/cliente/eliminar/:id", verificarAutenticacion, eliminarCliente); // Ruta para eliminar un paciente

export default router; // Exportar el enrutador

/*
Este código define un enrutador para manejar las solicitudes relacionadas con los pacientes. 
Las rutas están protegidas por el middleware de autenticación verificarAutenticacion. 
Cada ruta está asociada a un controlador específico que maneja la lógica de negocio correspondiente,
como iniciar sesión, obtener el perfil, listar pacientes, registrar un nuevo paciente, actualizar y eliminar pacientes. 
Las solicitudes HTTP POST, GET, PUT y DELETE se utilizan para realizar estas operaciones. Finalmente, 
el enrutador se exporta para su uso en otras partes de la aplicación.
*/
