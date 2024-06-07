// Importar Router de Express
import { Router } from 'express';
// Importar el modelo de equipo
const router = Router();

import {crearProforma, aceptarProforma} from '../controllers/proforma_controlller.js';


// Ruta para crear una nueva proforma
router.post('/proforma/registro/:ordenId', crearProforma);
// Ruta para aceptar la proforma
router.put('/ordenes/aceptar-proforma/:id', aceptarProforma);

export default router;