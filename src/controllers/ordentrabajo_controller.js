import mongoose from "mongoose"; // Importa mongoose para trabajar con la base de datos MongoDB
import Ordentrabajo from "../models/ordentrabajo.js";
import Cliente from "../models/Cliente.js"; // Asegúrate de tener el modelo Cliente importado
import ordentrabajo from "../models/ordentrabajo.js";
import { sendOrderToCliente } from "../config/nodemailer.js"; // Importa la función sendMailToCliente desde el archivo nodemailer.js para enviar correos electrónicos

// Método para registro de orden de trabajo
// Método para registro de orden de trabajo
const registrarOrdenTrabajo = async (req, res) => {
  try {
    // Validar que todos los campos estén llenos
    if (Object.values(req.body).includes("")) {
      return res
        .status(400)
        .json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    // Extraer los datos necesarios del cuerpo de la solicitud
    const { cedula, ingreso, clienteId, equipo } = req.body;

    // Buscar al cliente por su cédula
    const clienteExistente = await Cliente.findOne({ cedula });
    if (!clienteExistente) {
      return res.status(400).json({ msg: "Cliente no encontrado" });
    }

    // Validar la fecha de ingreso
    const currentDate = new Date().toISOString().split("T")[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
    if (ingreso <= currentDate) {
      return res.status(400).json({
        msg: "La fecha de ingreso debe ser igual o posterior a la fecha actual",
      });
    }

    // Formatear la fecha de ingreso a YYYY-MM-DD
    const formattedIngreso = new Date(ingreso).toISOString().split("T")[0];

    // Obtener el último número de orden registrado
    const ultimaOrden = await Ordentrabajo.findOne()
      .sort({ numOrden: -1 })
      .exec();
    let nuevoNumOrden = "0001"; // Valor por defecto
    if (ultimaOrden) {
      // Incrementar el número de orden
      const ultimoNumero = parseInt(ultimaOrden.numOrden, 10);
      nuevoNumOrden = (ultimoNumero + 1).toString().padStart(4, "0");
    }

    // Crear una nueva instancia de OrdenTrabajo con los datos proporcionados
    const nuevaOrden = new Ordentrabajo({
      ...req.body, // Usar los valores proporcionados en req.body
      ingreso: formattedIngreso, // Fecha de ingreso formateada
      salida: null,
      numOrden: nuevoNumOrden, // Número de orden calculado
      cliente: clienteId,
    });

    console.log(nuevaOrden);

    // Guardar la orden de trabajo en la base de datos
    await nuevaOrden.save();

    // Enviar el correo electrónico al cliente con la cédula y la contraseña
    await sendOrderToCliente(clienteExistente.correo, nuevoNumOrden, equipo);

    // Responder con un mensaje de éxito
    res.status(200).json({
      msg: "Orden de trabajo registrada exitosamente",
      clienteId: clienteExistente._id,
    });
  } catch (error) {
    console.error("Error al registrar orden de trabajo: ", error);
    res.status(500).json({ msg: "Error al registrar orden de trabajo" });
  }
};
/////////////////////////////////////////////////////////////////////////////////
//Metodo para listar ordenes de trabajo
const listarOrdenesTrabajo = async (req, res) => {
  try {
    let ordenesTrabajo;
    if (req.clienteBDD && "propietario" in req.clienteBDD) {
      // Si el clienteBDD existe y es propietario, buscar órdenes de trabajo asociadas a ese cliente
      ordenesTrabajo = await Ordentrabajo.find({
        cliente: req.clienteBDD._id,
      }).populate("cliente", "_id nombre correo telefono cedula");
    } else {
      // Si no hay cliente especificado, devolver todas las órdenes de trabajo
      ordenesTrabajo = await Ordentrabajo.find().populate(
        "cliente",
        "_id nombre correo telefono cedula"
      );
    }
    res.status(200).json(ordenesTrabajo);
  } catch (error) {
    console.error("Error al listar órdenes de trabajo: ", error);
    res.status(500).json({ msg: "Error al listar órdenes de trabajo" });
  }
};
/////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////
// Método para agregar un tipo de servicio a un equipo
const tipoServicio = async (req, res) => {
  try {
    const { tipoServicio } = req.body;
    const { id } = req.params;
    // Verificar si el equipo existe
    const equipo = await Ordentrabajo.findById(id);
    if (!equipo) {
      return res.status(404).json({ msg: "Equipo no encontrado" });
    }
    // Si el tipo de servicio es "Reparacion", redirigir al formulario de proforma
    if (tipoServicio === "Reparacion") {
      return res.redirect("/ruta_al_formulario_de_proforma");
    }
    // Si el tipo de servicio es distinto de "Reparacion", se guarda el tipo de servicio en el equipo
    equipo.tipoServicio = tipoServicio;
    // Si el estado es false, se agrega la fecha de salida
    if (!equipo.estado) {
      equipo.salida = new Date();
    }
    await equipo.save();
    res.json({ msg: "Tipo de servicio agregado correctamente", equipo });
  } catch (error) {
    console.error("Error al agregar tipo de servicio:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
};
/////////////////////////////////////////////////////////////////////////////////////

// Método para cambiar el estado de la orden de trabajo a "finalizado"
const finalizarOrdenTrabajo = async (req, res) => {
  try {
    const { id } = req.body; // Recibir el ID desde el cuerpo de la solicitud
    console.log(req.body);

    // Buscar la orden de trabajo por su número
    const orden = await Ordentrabajo.findOne({ _id: id });

    if (!orden) {
      return res.status(404).json({ msg: "Orden de trabajo no encontrada" });
    }
    // Cambiar el estado a 'finalizado'
    orden.estado = "finalizado";
    orden.salida = new Date();
    await orden.save();

    res.status(200).json({
      msg: "Estado de la orden de trabajo actualizado a 'finalizado'",
    });
  } catch (error) {
    console.error("Error al finalizar la orden de trabajo: ", error);
    res.status(500).json({ msg: "Error al finalizar la orden de trabajo" });
  }
};

/////////////////////////////////////////////////////////////////////////////////////
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
        mensaje: `No se encontró una orden de trabajo con el número de orden: ${numOrden}`,
      });
    }
    // Devolver la orden de trabajo encontrada
    return res.status(200).json(orden);
  } catch (error) {
    // Manejar errores y devolver una respuesta con el mensaje de error
    return res.status(500).json({
      mensaje: "Error al buscar la orden de trabajo",
      error: error.message,
    });
  }
};

const detalleProforma = async (req, res) => {
  const { id } = req.params; // Extrae el ID del paciente de los parámetros de la solicitud
  // Verifica si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el paciente ${id}` });
  // Busca al paciente por su ID y lo popula con la información del veterinario asociado y los tratamientos asociados
  const ordenes = await ordentrabajo
    .findById(id)
    .populate("cliente", "_id nombre cedula");
  // Responde con el detalle del paciente y sus tratamientos
  res.status(200).json({
    ordenes,
  });
};

const detalleOrden = async (req, res) => {
  const { id } = req.params; // Extrae el ID del paciente de los parámetros de la solicitud
  // Verifica si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: `Lo sentimos, no existe el paciente ${id}` });
  // Busca al paciente por su ID y lo popula con la información del veterinario asociado y los tratamientos asociados
  const ordenes = await ordentrabajo
    .findById(id)
    .populate("cliente", "_id nombre cedula");
  // Responde con el detalle del paciente y sus tratamientos
  res.status(200).json({
    ordenes,
  });
};

// Exporta los métodos de la API relacionados con la gestión de tratamientos
export {
  buscarClientePorCedula,
  tipoServicio,
  buscarOrdenPorNumero,
  registrarOrdenTrabajo,
  listarOrdenesTrabajo,
  finalizarOrdenTrabajo,
  detalleProforma,
  detalleOrden,
};
