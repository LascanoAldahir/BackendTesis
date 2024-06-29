// Importar JWT y los modelos de Veterinario y Paciente
import jwt from "jsonwebtoken";
import Tecnico from "../models/Tecnico.js";
import Cliente from "../models/Cliente.js";

// Método para proteger rutas
const verificarAutenticacion = async (req, res, next) => {
  // Validar si se está enviando el token
  if (!req.headers.authorization)
    return res.status(404).json({ msg: "Lo sentimos, debes proporcionar un token" });

  // Desestructurar el token del encabezado
  const { authorization } = req.headers;

  // Capturar errores
  try {
    // Verificar el token recuperado con el almacenado
      const { id, rol } = jwt.verify(
      authorization.split(" ")[1],
      process.env.JWT_SECRET
    );

    // Verificar el rol
    if (rol === "tecnico") {
      // Obtener el usuario tecnico de la base de datos y excluir el campo de la contraseña
      req.tecnicoBDD = await Tecnico.findById(id).lean().select("-password");
      // Continuar el proceso
      next();
    } else if (rol === "cliente") {
      // Obtener el usuario cliente de la base de datos y excluir el campo de la contraseña
      req.clienteBDD = await Cliente.findById(id).lean().select("-password");
      // Continuar el proceso
      next();
    } else {
      // Si el rol no es válido
      return res.status(403).json({ msg: "Rol no autorizado" });
    }
  } catch (error) {
    // Capturar errores y presentarlos
    const e = new Error("Formato del token no válido");
    return res.status(404).json({ msg: e.message });
  }
};
///////////////////////////////////////////////////////////////////////////////
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'Sin token, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token no valido' });
  }
};

const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.rol !== role) {
        return res.status(403).json({ msg: 'Acceso denegado' });
      }
      next();
    } catch (err) {
      res.status(500).json({ msg: 'Error de servidor' });
    }
  };
};

export { verificarAutenticacion, verifyToken, checkRole };