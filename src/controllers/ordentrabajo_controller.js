import mongoose from "mongoose"; // Importa mongoose para trabajar con la base de datos MongoDB
import Ordentrabajo from "../models/ordentrabajo.js";
import { sendMailToCliente } from "../config/nodemailer.js"; 

//metodo para registro de orden de trabajo
const registrarOrdenTrabajo = async (req, res) => {
    try {
      // Desestructurar los datos recibidos
      const { cliente, equipo, modelo, marca, serie, color, razon, servicio } = req.body;
      // Validar que todos los campos estén llenos
      if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
      }
      // Buscar el cliente en la base de datos por su cédula
      const clienteExistente = await Cliente.findOne({ cedula: cliente });
      if (!clienteExistente) {
        return res.status(400).json({ msg: "Cliente no encontrado" });
      }  
      // Crear una nueva instancia de OrdenTrabajo con los datos proporcionados
      const nuevaOrden = new OrdenTrabajo({
        cliente: clienteExistente._id,
        equipo,
        modelo,
        marca,
        serie,
        color,
        ingreso: Date.now(), // Puedes ajustar esto si necesitas una fecha específica
        razon,
        fechaSalida: null, // Dejar nulo inicialmente
        servicio,
        estado: "pendiente",
        tecnico: req.tecnicoBDD._id
      });
      // Guardar la orden de trabajo en la base de datos
      await nuevaOrden.save();
      // enviar un correo electrónico al cliente con los detalles de la orden de trabajo
      await sendMailToCliente(clienteExistente.correo, `Se ha registrado una nueva orden de trabajo con el número: ${nuevaOrden._id}`);
  
      // Responder con un mensaje de éxito
      res.status(200).json({ msg: "Orden de trabajo registrada exitosamente" });
    } catch (error) {
      console.error("Error al registrar orden de trabajo: ", error);
      res.status(500).json({ msg: "Error al registrar orden de trabajo" });
    }
  };


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
        const equipo = await Ordentrabajo.findById(id);
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
const buscarOrdenPorNumero = async (req, res) => {
    try {
        // Obtener el número de orden de los parámetros de la solicitud
        const { numOrden } = req.params;
        // Buscar la orden de trabajo en la base de datos por el número de orden
        const orden = await Ordentrabajo.findOne({ numOrden });
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
    registrarOrdenTrabajo
}
