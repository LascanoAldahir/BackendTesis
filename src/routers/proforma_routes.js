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


router.get('/visualizar/:id', visualizarOrden);


export default router;