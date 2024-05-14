import { Router } from 'express';
const router = Router();

// Importar controladores de tratamientos
import {
    detalleEquipo,
    registrarEquipo,
    actualizarEquipo,
    eliminarEquipo,
    cambiarEstado
} from "../controllers/equipo_controller.js";

// Importar middleware de autenticación
import verificarAutenticacion from "../middlewares/autenticacion.js";

// Rutas para el manejo de Equipos
// Ruta para registrar un nuevo Equipos
router.post('/equipo/registro', verificarAutenticacion, registrarEquipo);

// Ruta para obtener el detalle de un tratamiento específico
router.get('/equipo/:id', verificarAutenticacion, detalleEquipo);

// Ruta para actualizar el estado de un equipo
// router.put('/tratamiento/:id',verificarAutenticacion,actualizarTratamiento)
router.put('/equipo/estado/:id', verificarAutenticacion, actualizarEquipo);

// Ruta para eliminar un tratamiento
router.delete('/equipo/:id', verificarAutenticacion, eliminarEquipo);

// Ruta para cambiar el estado de un tratamiento
router.post('/equipo/estado/:id', verificarAutenticacion, cambiarEstado);

export default router; // Exportar el enrutador