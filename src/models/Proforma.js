// Importar el Schema y el modelo de mongoose
import { Schema, model } from 'mongoose';

// Definir el esquema del tratamiento
const proformaSchema = new Schema({
    ordenId: {
      type: Schema.Types.ObjectId,
      ref: 'ordentrabajo', // Referencia al modelo de Orden de Trabajo
      required: true
    },
    piezas: [{
      pieza: {
        type: String,
        required: true,
        trim: true
      },
      precio: {
        type: Number,
        required: true,
        min: 0
      }
    }],
    precioTotal: {
      type: Number,
      required: true,
      min: 0
    }
  }, {
    timestamps: true // Agregar timestamps de creación y modificación automáticamente
  });

export default model('Proforma', proformaSchema);
