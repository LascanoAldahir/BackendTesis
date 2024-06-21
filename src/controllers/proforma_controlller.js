import Proforma from "../models/Proforma.js"; // Ajusta la ruta según tu estructura de archivos
import mongoose from "mongoose"; // Importa mongoose para trabajar con la base de datos MongoDB

// Método para crear una nueva proforma
const crearProforma = async (req, res) => {
  try {
    const { piezas, precioTotal } = req.body;
    const { ordenId } = req.params;

    // Verificar si el ordenId es válido
    if (!mongoose.Types.ObjectId.isValid(ordenId)) {
      return res.status(400).json({ msg: "ID de la orden de trabajo no válido" });
    }

    const nuevaProforma = new Proforma({
      ordenId,
      piezas,
      precioTotal,
    });

    await nuevaProforma.save();

    res.status(201).json({
      msg: "Proforma creada exitosamente",
      proforma: nuevaProforma,
    });
  } catch (error) {
    console.error("Error al crear la proforma:", error);
    res.status(500).json({ msg: "Error al crear la proforma" });
  }
};
//////////////////////////////////////////////////////////////

// Método para obtener la proforma por el número de orden
const visualizarProforma = async (req, res) => {
  try {
    const { ordenId } = req.params;
    const proforma = await Proforma.findOne({ ordenId }).populate('ordenId');
    if (!proforma) {
      return res.status(404).json({ msg: "Proforma no encontrada para el número de orden proporcionado" });
    }

    res.status(200).json({
      msg: "Proforma obtenida exitosamente",
      proforma,
    });
  } catch (error) {
    console.error("Error al obtener la proforma:", error);
    res.status(500).json({ msg: "Error al obtener la proforma" });
  }
};

//////////////////////////////////////////////////////////////

// Método para aceptar la proforma y cambiar estadoProforma a true
const aceptarProforma = async (req, res) => {
  try {
    const { id } = req.params; // Recibir el ID desde los parámetros de la URL
    console.log(req.params);
    // Buscar la orden de trabajo por su ID
    const orden = await Ordentrabajo.findOne({ _id: id });
    if (!orden) {
      return res.status(404).json({ msg: "Orden de trabajo no encontrada" });
    }
    // Cambiar el estadoProforma a true
    orden.estadoProforma = true;
    await orden.save();
    res.status(200).json({
      msg: "Estado de la proforma actualizado a 'aceptado'",
    });
  } catch (error) {
    console.error("Error al aceptar la proforma: ", error);
    res.status(500).json({ msg: "Error al aceptar la proforma" });
  }
};

// Método para listar proformas por ordenId
const listarProformas = async (req, res) => {
  try {
    const { ordenId } = req.params;

    // Verificar si el ordenId es válido
    if (!mongoose.Types.ObjectId.isValid(ordenId)) {
      return res.status(400).json({ msg: "ID de la orden de trabajo no válido" });
    }

    const proformas = await Proforma.find({ ordenId });

    if (!proformas.length) {
      return res.status(404).json({ msg: "No se encontraron proformas para esta orden de trabajo" });
    }

    res.status(200).json({
      msg: "Proformas obtenidas exitosamente",
      proformas,
    });
  } catch (error) {
    console.error("Error al obtener las proformas:", error);
    res.status(500).json({ msg: "Error al obtener las proformas" });
  }
};

export { crearProforma, aceptarProforma, listarProformas, visualizarProforma };