import { Router } from 'express';
const router = Router();

// Importar controladores de pacientes
import {
    actualizarPaciente,
    detallePaciente,
    eliminarPaciente,
    listarPacientes,
    registrarPaciente,
    loginPaciente,
    perfilPaciente 
} from "../controllers/paciente_controller.js";

// Importar middleware de autenticación
import verificarAutenticacion from "../middlewares/autenticacion.js";

// Rutas para el manejo de pacientes
router.post('/paciente/login', loginPaciente); // Ruta para iniciar sesión de pacientes

router.get('/paciente/perfil', verificarAutenticacion, perfilPaciente); // Ruta para obtener el perfil del paciente
router.get("/pacientes", verificarAutenticacion, listarPacientes); // Ruta para listar todos los pacientes
router.get("/paciente/:id", verificarAutenticacion, detallePaciente); // Ruta para obtener detalles de un paciente específico
router.post("/paciente/registro", verificarAutenticacion, registrarPaciente); // Ruta para registrar un nuevo paciente
router.put("/paciente/actualizar/:id", verificarAutenticacion, actualizarPaciente); // Ruta para actualizar los datos de un paciente
router.delete("/paciente/eliminar/:id", verificarAutenticacion, eliminarPaciente); // Ruta para eliminar un paciente

export default router; // Exportar el enrutador

/*
Este código define un enrutador para manejar las solicitudes relacionadas con los pacientes. 
Las rutas están protegidas por el middleware de autenticación verificarAutenticacion. 
Cada ruta está asociada a un controlador específico que maneja la lógica de negocio correspondiente,
como iniciar sesión, obtener el perfil, listar pacientes, registrar un nuevo paciente, actualizar y eliminar pacientes. 
Las solicitudes HTTP POST, GET, PUT y DELETE se utilizan para realizar estas operaciones. Finalmente, 
el enrutador se exporta para su uso en otras partes de la aplicación.
*/
