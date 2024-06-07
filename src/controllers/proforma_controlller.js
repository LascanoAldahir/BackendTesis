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

export { crearProforma };
