import { Router } from 'express';
import { buscarOrdenPorNumero } from '../controllers/ordentrabajo_controller.js';
// Importar el modelo de equipo

const router = Router();

// Importar middleware de autenticación
import verificarAutenticacion from "../middlewares/autenticacion.js";

// Definir la ruta para buscar órdenes de trabajo por número de orden
router.get('/ordenes/:numOrden', buscarOrdenPorNumero);

export default router; // Exportar el enrutador