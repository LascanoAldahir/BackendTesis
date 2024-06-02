import Proforma from '../models/Proforma';

const crearProforma = async (req, res) => {
  try {
    const { pieza, precio, precioFinal, clienteNombre, clienteCedula, Precio, precioTotal } = req.body;

    const nuevaProforma = new Proforma({
      pieza,
      precio,
      precioFinal,
      clienteNombre,
      clienteCedula,
      Precio,
      precioTotal,
    });

    await nuevaProforma.save();

    res.status(201).json({
      msg: 'Proforma creada exitosamente',
      proforma: nuevaProforma,
    });
  } catch (error) {
    console.error('Error al crear la proforma: ', error);
    res.status(500).json({ msg: 'Error al crear la proforma' });
  }
};

export{
 crearProforma 
}