// Importar JWT y los modelos de Veterinario y Paciente
import jwt from 'jsonwebtoken';
import Tecnico from '../models/Tecnico.js';
import Cliente from '../models/Cliente.js';

// Método para proteger rutas
const verificarAutenticacion = async (req, res, next) => {
    // Validar si se está enviando el token
    if (!req.headers.authorization) return res.status(404).json({ msg: "Lo sentimos, debes proporcionar un token" });

    // Desestructurar el token del encabezado
    const { authorization } = req.headers;

    // Capturar errores
    try {
        // Verificar el token recuperado con el almacenado
        const { id, rol } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);

        // Verificar el rol
        if (rol === "tecnico") {
            // Obtener el usuario tecnicoo de la base de datos y excluir el campo de la contraseña
            req.tecnicoBDD = await Tecnico.findById(id).lean().select("-password");
            // Continuar el proceso
            next();
        } else {
            // Obtener el usuario paciente de la base de datos y excluir el campo de la contraseña
            req.tecnicoBDD = await Tecnico.findById(id).lean().select("-password");
            // Continuar el proceso
            next();
        }
    } catch (error) {
        // Capturar errores y presentarlos
        const e = new Error("Formato del token no válido");
        return res.status(404).json({ msg: e.message });
    }
};

// Exportar el método
export default verificarAutenticacion;