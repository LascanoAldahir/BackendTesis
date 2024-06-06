import Proforma from '../models/Proforma';

//Metodo para crear proforma
const crearProforma = async (req, res) => {
  try {
    const {
      ordenN,
      equipo,
      cliente,
      serie,
      componente,
      modelo,
      aceptado,
      pieza,
      precio,
      precioFinal,
      clienteCedula,
      precioTotal,
      salida,
      observaciones
    } = req.body;

    const nuevaProforma = new Proforma({
      ordenN,
      equipo,
      cliente,
      serie,
      componente,
      modelo,
      aceptado,
      pieza,
      precio,
      precioFinal,
      clienteCedula,
      precioTotal,
      salida,
      observaciones
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