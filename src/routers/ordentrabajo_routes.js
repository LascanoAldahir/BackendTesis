import { Router } from 'express';
import { buscarOrdenPorNumero, 
    registrarOrdenTrabajo,
    listarOrdenesTrabajo,
    finalizarOrdenTrabajo,
    detalleProforma,
    detalleOrden
} from '../controllers/ordentrabajo_controller.js';

// Importar el modelo de equipo
const router = Router();

// Definir la ruta para buscar órdenes de trabajo por número de orden
router.get('/orden/:numOrden', buscarOrdenPorNumero);
// Ruta para registrar una nueva orden de trabajo
router.post('/orden/registro', registrarOrdenTrabajo);
// Ruta para listar las órdenes de trabajo
router.get('/ordenes/listar', listarOrdenesTrabajo);
// Ruta para finalizar la orden de trabajo
router.put('/ordenes/finalizar/:id', finalizarOrdenTrabajo);
// Ruta para la proforma
router.get("/orden/visualizar/:id",detalleProforma);

// Ruta para la ordenes normales
router.put("/orden/actualizar/:id",detalleOrden);


export default router; // Exportar el enrutador