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


export { crearProforma, aceptarProforma };
