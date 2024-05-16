import { Router } from 'express';
// Importar el modelo de equipo
import Equipo from '../models/Equipo.js';

const router = Router();

// Importar controladores de tratamientos
import {
    detalleEquipo,
    registrarEquipo,
    actualizarEquipo,
    eliminarEquipo,
    cambiarEstado,
    tipoServicio 
} from "../controllers/equipo_controller.js";

// Importar middleware de autenticación
import verificarAutenticacion from "../middlewares/autenticacion.js";

// Rutas para el manejo de Equipos
// Ruta para registrar un nuevo Equipos
router.post('/equipo/registro', verificarAutenticacion, registrarEquipo);

// Ruta para obtener el detalle de un tratamiento específico
router.get('/equipo/:id', verificarAutenticacion, detalleEquipo);

// Ruta para actualizar el estado de un equipo
// router.put('/tratamiento/:id',verificarAutenticacion,actualizarTratamiento)
router.put('/equipo/estado/:id', verificarAutenticacion, actualizarEquipo);

// Ruta para eliminar un tratamiento
router.delete('/equipo/:id', verificarAutenticacion, eliminarEquipo);

// Ruta para cambiar el estado de un tratamiento
router.post('/equipo/estado/:id', verificarAutenticacion, cambiarEstado);

//Ruta para definir el tipo de servicio 
router.put('/equipo/:id/tiposervicio', tipoServicio);

// Ruta para mostrar el formulario de proforma para un cliente específico
router.get('/cliente/:id/proforma', async (req, res) => {
    try {
        const { id } = req.params;
        // Buscar el equipo del cliente
        const equipo = await Equipo.findById(id);
        if (!equipo) {
            return res.status(404).json({ msg: 'Equipo no encontrado' });
        }
        // Si el tipo de servicio es reparación, mostrar el formulario de proforma
        if (equipo.tipoServicio === 'Reparación') {
            // Renderizar el formulario de proforma para el cliente
            res.render('formulario_proforma_cliente', { equipo });
        } else {
            res.status(400).json({ msg: 'El equipo no está en reparación' });
        }
    } catch (error) {
        console.error('Error al obtener el equipo:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

export default router; // Exportar el enrutador