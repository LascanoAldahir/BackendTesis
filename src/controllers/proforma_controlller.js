import Proforma from "../models/Proforma.js"; // Ajusta la ruta según tu estructura de archivos

const crearProforma = async (req, res) => {
  try {
    const { piezas, precioTotal } = req.body;
    const { ordenId } = req.params;

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
    res.status(500).json({ msg: "Error al crear la proforma" }); // Asegúrate de devolver JSON
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
/////////////////////////////////////////////////////
// Método para obtener una proforma específica por su ID
const listarProformas = async (req, res) => {
  const { id } = req.params; // Extrae el ID de la proforma de los parámetros de la solicitud

  // Verifica si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ msg: `Lo sentimos, no existe la proforma con ID ${id}` });
  }

  try {
    // Busca la proforma por su ID
    const proforma = await Proforma.findById(id);

    if (!proforma) {
      return res.status(404).json({ msg: `No se encontró la proforma con ID ${id}` });
    }

    // Responde con el detalle de la proforma
    res.status(200).json(proforma);
  } catch (error) {
    console.error("Error al obtener el detalle de la proforma:", error);
    res.status(500).json({ msg: "Error al obtener el detalle de la proforma" });
  }
};

export { crearProforma, aceptarProforma, listarProformas };
