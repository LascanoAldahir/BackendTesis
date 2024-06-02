// Importar el Schema y el modelo de mongoose
import { Schema, model } from 'mongoose';

// Definir el esquema del tratamiento
const proformaSchema = new Schema({
    
    ordenN: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        trim: true      // Se eliminan espacios en blanco al inicio y al final
    },
    
    equipo: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        trim: true      // Se eliminan espacios en blanco al inicio y al final
    },
    
    cliente : {
        type: String,  
        required: true, // Campo obligatorio
        default: true   // Valor por defecto: true
    },
    serie: {
        type: String,  
        required: true, // Campo obligatorio
        default: true   // Valor por defecto: true
    },
    componente: {
        type: String,
        required: true, 
        default: true  
    },
    modelo: {
        type: String,
        required: true,
        enum: ['Revision','Mantenimiento','Reparacion']
    },
    aceptado: {
        type: Boolean,
        required: true,
        default: false 
    },
    pieza:{
        type: String,

    },
    precio:{
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    pieza: {
        type: String,
        required: true,
        trim: true,
      },
      precio: {
        type: String,
        required: true,
        trim: true,
      },
      precioFinal: {
        type: String,
        required: true,
        trim: true,
      },
      clienteCedula: {
        type: Number,
        required: true,
      },
      precio: {
        type: Number, 
        required: true,
      },
      precioTotal: {
        type: Number, 
        required: true,
      },
    
}, {
    timestamps: true // Agregar timestamps de creación y modificación automáticamente
});

// Exportar el modelo 'Equipo' basado en el esquema 'equipoSchema'
export default model('Proforma', proformaSchema);