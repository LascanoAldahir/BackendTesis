// Importar Router de Express
import { Router } from 'express';

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
} from "../controllers/tecnico_controller.js";

// Importar middleware de autenticación
import verificarAutenticacion from '../middlewares/autenticacion.js';

// Importar middleware de validación
import { validacionTecnico } from '../middlewares/validacionTecnico.js';

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

// Exportar la variable router
export default router;

