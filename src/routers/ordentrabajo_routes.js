import { Router } from 'express';
import { buscarOrdenPorNumero, 
    registrarOrdenTrabajo 
} from '../controllers/ordentrabajo_controller.js';

// Importar el modelo de equipo
const router = express.Router();

// Definir la ruta para buscar órdenes de trabajo por número de orden
router.get('/ordenes/:numOrden', buscarOrdenPorNumero);

// Ruta para registrar una nueva orden de trabajo
router.post('/ordenes', registrarOrdenTrabajo);

export default router; // Exportar el enrutador