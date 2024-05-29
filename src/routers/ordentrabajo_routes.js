import { Router } from 'express';
import { buscarOrdenPorNumero, 
    registrarOrdenTrabajo,
    listarOrdenesTrabajo 
} from '../controllers/ordentrabajo_controller.js';

// Importar el modelo de equipo
const router = Router();

// Definir la ruta para buscar órdenes de trabajo por número de orden
router.get('/ordenes/:numOrden', buscarOrdenPorNumero);
// Ruta para registrar una nueva orden de trabajo
router.post('/ordenes/registrar', registrarOrdenTrabajo);
// Ruta para listar las órdenes de trabajo
router.get('/ordenes-trabajo', listarOrdenesTrabajo);

export default router; // Exportar el enrutador