import { 
    detalleOrden,
} from '../controllers/proforma_controlller.js';

// Importar el modelo de equipo
const router = Router();

// Ruta para la ordenes normales
router.put("/orden/actualizar/:id",detalleOrden);
// Ruta para crear una nueva proforma
router.post('/proformas', crearProforma);