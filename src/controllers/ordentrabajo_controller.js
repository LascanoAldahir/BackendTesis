import mongoose from "mongoose"; // Importa mongoose para trabajar con la base de datos MongoDB
import ordentrabajo from "../models/ordentrabajo.js";

// Buscar cliente por cedula
const buscarClientePorCedula = async (req, res) => {
    const { cedula } = req.params;
    try {
      const cliente = await Cliente.findOne({ cedula });
      if (!cliente) {
        return res.status(404).json({ mensaje: "Cliente no encontrado" });
      }
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al buscar el cliente" });
    }
  };

// Método para agregar un tipo de servicio a un equipo
const tipoServicio = async (req, res) => {
    try {
        const { tipoServicio } = req.body;
        const { id } = req.params;
        // Verificar si el equipo existe
        const equipo = await Equipo.findById(id);
        if (!equipo) {
            return res.status(404).json({ msg: 'Equipo no encontrado' });
        }
        // Si el tipo de servicio es "Reparacion", redirigir al formulario de proforma
        if (tipoServicio === 'Reparacion') {
            return res.redirect('/ruta_al_formulario_de_proforma');
        }
        // Si el tipo de servicio es distinto de "Reparacion", se guarda el tipo de servicio en el equipo
        equipo.tipoServicio = tipoServicio;
        // Si el estado es false, se agrega la fecha de salida
        if (!equipo.estado) {
            equipo.salida = new Date();
        }
        await equipo.save();
        res.json({ msg: 'Tipo de servicio agregado correctamente', equipo });
    } catch (error) {
        console.error('Error al agregar tipo de servicio:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};


// Definir el controlador para buscar órdenes de trabajo por número de orden
export const buscarOrdenPorNumero = async (req, res) => {
    try {
        // Obtener el número de orden de los parámetros de la solicitud
        const { numOrden } = req.params;

        // Buscar la orden de trabajo en la base de datos por el número de orden
        const orden = await OrdenTrabajo.findOne({ numOrden });

        // Verificar si se encontró la orden de trabajo
        if (!orden) {
            return res.status(404).json({
                mensaje: `No se encontró una orden de trabajo con el número de orden: ${numOrden}`
            });
        }

        // Devolver la orden de trabajo encontrada
        return res.status(200).json(orden);
    } catch (error) {
        // Manejar errores y devolver una respuesta con el mensaje de error
        return res.status(500).json({
            mensaje: 'Error al buscar la orden de trabajo',
            error: error.message
        });
    }
};

// Exporta los métodos de la API relacionados con la gestión de tratamientos
export {
    buscarClientePorCedula,
    tipoServicio,
    buscarOrdenPorNumero,
}
