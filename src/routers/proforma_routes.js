// Importar Router de Express
import { Router } from 'express';
// Importar el modelo de equipo
const router = Router();

import {crearProforma, aceptarProforma,listarProformas,visualizarOrden} from '../controllers/proforma_controlller.js';


// Ruta para crear una nueva proforma
router.post('/proforma/registro/:ordenId', crearProforma);
// Ruta para aceptar la proforma
router.put('/ordenes/aceptar-proforma/:id', aceptarProforma);
// Ruta para listar todas las proformas asociadas a una orden de trabajo específica por su ID
router.get('/proformas/orden/:ordenId', listarProformas);
// Ruta para visualizar una proforma específica por ID de la orden de trabajo
router.get('/orden/visualizar/:id', visualizarOrden); // Endpoint para visualizar una orden de trabajo por su ID



export default router;