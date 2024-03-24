import { Router } from 'express';
const router = Router();

// Importar controladores de tratamientos
import {
    detalleTratamiento,
    registrarTratamiento,
    actualizarTratamiento,
    eliminarTratamiento,
    cambiarEstado
} from "../controllers/tratamiento_controller.js";

// Importar middleware de autenticación
import verificarAutenticacion from "../middlewares/autenticacion.js";

// Rutas para el manejo de tratamientos
// Ruta para registrar un nuevo tratamiento
router.post('/tratamiento/registro', verificarAutenticacion, registrarTratamiento);

// Ruta para obtener el detalle de un tratamiento específico
router.get('/tratamiento/:id', verificarAutenticacion, detalleTratamiento);

// Ruta para actualizar el estado de un tratamiento
// router.put('/tratamiento/:id',verificarAutenticacion,actualizarTratamiento)
router.put('/tratamiento/estado/:id', verificarAutenticacion, actualizarTratamiento);

// Ruta para eliminar un tratamiento
router.delete('/tratamiento/:id', verificarAutenticacion, eliminarTratamiento);

// Ruta para cambiar el estado de un tratamiento
router.post('/tratamiento/estado/:id', verificarAutenticacion, cambiarEstado);

export default router; // Exportar el enrutador
