// Importar Router de Express
import { Router } from 'express';
// Importar middleware de autenticación y validación
import { verifyToken, checkRole } from "../middlewares/autenticacion.js";
import { validacionTecnico } from '../middlewares/validacionTecnico.js';
// Importar middleware de autenticación
import { verificarAutenticacion } from "../middlewares/autenticacion.js";

// Crear una instancia de Router()
const router = Router();

// Importar métodos del controlador
import {
    login,
    perfil,
    registro,
    confirmEmail,
    listarTecnicos,
    detalleTecnico,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    eliminarTecnico,
    verificarAdmin
} from "../controllers/tecnico_controller.js";


// Rutas públicas
router.post("/login", login);
router.post("/registro", validacionTecnico, registro);
router.get("/confirmar/:token", confirmEmail);
router.get("/tecnicos", listarTecnicos);
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPasword);
router.post("/nuevo-password/:token", nuevoPassword);

// Rutas privadas

router.get("/perfil", verificarAutenticacion, perfil);
router.put('/tecnico/actualizarpassword', verificarAutenticacion, actualizarPassword);
router.get("/tecnico/:id", verificarAutenticacion, detalleTecnico);
router.put("/tecnico/:id", verificarAutenticacion, actualizarPerfil);
router.delete('/tecnico/eliminar/:id', verificarAutenticacion,eliminarTecnico);

// Ruta para verificar si un técnico tiene el rol de administrador
router.get('/tecnico/verificar-admin/:id', verifyToken, verificarAdmin);

  
  export default router;

