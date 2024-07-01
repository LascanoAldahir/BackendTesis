import { Router } from 'express';

// Importar controladores de tratamientos
const router = Router();

// Importar controladores de clientes
import {
  actualizarCliente,
  detalleCliente,
  eliminarCliente,
  listarClientes,
  registrarCliente,
  loginCliente,
  buscarClientePorCedula,
  perfilCliente,
  recuperarPasswordCli,
  comprobarTokenPasswordCli,
  nuevoPasswordCli,
  actualizarPasswordCli
} from "../controllers/cliente_controller.js";
import { verificarAutenticacion} from '../middlewares/autenticacion.js';


// Rutas para el manejo de pacientes
router.post('/cliente/login', loginCliente); // Ruta para iniciar sesión de pacientes

router.get('/cliente/perfil', verificarAutenticacion, perfilCliente); // Ruta para obtener el perfil del paciente
router.get("/clientes", verificarAutenticacion, listarClientes); // Ruta para listar todos los pacientes
router.get("/cliente/:id", verificarAutenticacion, detalleCliente); // Ruta para obtener detalles de un paciente específico

// Rutas para recuperación de contraseña de clientes
router.post("/cliente/recuperar-password", recuperarPasswordCli);
router.get("/cliente/recuperar-password/:token", verificarAutenticacion, comprobarTokenPasswordCli);
router.post("/cliente/nuevo-passwordCli/:token", verificarAutenticacion, nuevoPasswordCli);

// Ruta para actualizar la contraseña del cliente autenticado
router.put("/actualizar-password", verificarAutenticacion, actualizarPasswordCli);

router.post("/cliente/registro", verificarAutenticacion, registrarCliente); // Ruta para registrar un nuevo paciente
router.get('/clientes/cedula/:cedula', verificarAutenticacion,buscarClientePorCedula);
router.put("/cliente/actualizar/:id", verificarAutenticacion, actualizarCliente); // Ruta para actualizar los datos de un paciente
router.delete("/cliente/eliminar/:id", verificarAutenticacion, eliminarCliente); // Ruta para eliminar un paciente

export default router; //Exportar el enrutador