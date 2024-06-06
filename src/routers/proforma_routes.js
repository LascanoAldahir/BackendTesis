// Importar Router de Express
import { Router } from 'express';
// Importar el modelo de equipo
const router = Router();

import {crearProforma} from '../controllers/proforma_controlller.js';


// Ruta para crear una nueva proforma
router.post('/proformas', crearProforma);

export default router;