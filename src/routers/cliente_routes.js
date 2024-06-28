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
import { verificarAutenticacionCli } from '../middlewares/autenticacion.js';


// Rutas para el manejo de pacientes
router.post('/cliente/login', loginCliente); // Ruta para iniciar sesión de pacientes

router.get('/cliente/perfil', verificarAutenticacionCli, perfilCliente); // Ruta para obtener el perfil del paciente
router.get("/clientes", verificarAutenticacionCli, listarClientes); // Ruta para listar todos los pacientes
router.get("/cliente/:id", verificarAutenticacionCli, detalleCliente); // Ruta para obtener detalles de un paciente específico

// Rutas para recuperación de contraseña de clientes
router.post("/cliente/recuperar-password", recuperarPasswordCli);
router.get("/cliente/recuperar-password/:token", comprobarTokenPasswordCli);
router.post("/cliente/nuevo-passwordCli/:token", nuevoPasswordCli);

// Ruta para actualizar la contraseña del cliente autenticado
router.put("/actualizar-password", verificarAutenticacionCli, actualizarPasswordCli);

router.post("/cliente/registro", verificarAutenticacionCli, registrarCliente); // Ruta para registrar un nuevo paciente
router.get('/clientes/cedula/:cedula', verificarAutenticacionCli,buscarClientePorCedula);
router.put("/cliente/actualizar/:id", verificarAutenticacionCli, actualizarCliente); // Ruta para actualizar los datos de un paciente
router.delete("/cliente/eliminar/:id", verificarAutenticacionCli, eliminarCliente); // Ruta para eliminar un paciente

export default router; // Exportar el enrutador