// Importar Router de Express
import { Router } from 'express';
// Importar middleware de autenticación y validación
import { verifyToken, checkRole } from "../middlewares/autenticacion.js";
import { validacionTecnico } from '../middlewares/validacionTecnico.js';
// Importar middleware de autenticación
import { verificarAutenticacionTec } from "../middlewares/autenticacion.js";

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
    eliminarTecnico
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

router.get("/perfil", verificarAutenticacionTec, perfil);
router.put('/tecnico/actualizarpassword', verificarAutenticacionTec, actualizarPassword);
router.get("/tecnico/:id", verificarAutenticacionTec, detalleTecnico);
router.put("/tecnico/:id", verificarAutenticacionTec, actualizarPerfil);
router.delete('/tecnico/eliminar/:id', verificarAutenticacionTec,eliminarTecnico);

// Ruta para registrar nuevos técnicos
router.post('/tecnicoAdmin/registrar', verificarAutenticacionTec, async (req, res) => {
    const { nombre, email, password } = req.body;
  
    try {
      // Aquí puedes acceder al técnico autenticado
      const tecnicoAutenticado = req.tecnicoBDD;
  
      // Verificar que el técnico autenticado tenga permisos para crear nuevos técnicos
      if (!tecnicoAutenticado.permisos.includes('crear_tecnico')) {
        return res.status(403).json({ msg: "No tienes permisos para realizar esta acción" });
      }
  
      let user = await Tecnico.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'El usuario ya existe' });
      }
  
      user = new Tecnico({
        nombre,
        email,
        password,
        rol: 'tecnico',
      });
  
      user.password = await user.encrypPassword(password);
  
      await user.save();
  
      res.status(201).json({ msg: 'Nuevo técnico registrado' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  export default router;

