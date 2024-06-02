import { 
    detalleOrden,
} from '../controllers/proforma_controlller.js';

// Importar el modelo de equipo
const router = Router();


// Ruta para crear una nueva proforma
router.post('/proformas', crearProforma);