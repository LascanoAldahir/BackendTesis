// Importar el Schema y el modelo de mongoose
import { Schema, model } from 'mongoose';
// Importar bcrypt para cifrar las contraseñas
import bcrypt from "bcryptjs";

// Definir el esquema del tratamiento
const proformaSchema = new Schema({
    // Campo para el nombre del tratamiento
    ordenN: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        trim: true      // Se eliminan espacios en blanco al inicio y al final
    },
    // Campo para la descripción del tratamiento
    equipo: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        trim: true      // Se eliminan espacios en blanco al inicio y al final
    },
    // Campo para el estado del tratamiento (activo o inactivo)
    cliente : {
        type: String,  
        required: true, // Campo obligatorio
        default: true   // Valor por defecto: true
    },
    // Campo para la prioridad del tratamiento (Baja, Media, Alta)
    serie: {
        type: String,  
        required: true, // Campo obligatorio
        default: true   // Valor por defecto: true
    },
    // Campo para referenciar el paciente al que se aplica el tratamiento
    componente: {
        type: String,
        required: true, // Campo obligatorio
        default: true   // Valor por defecto: true
    },
    modelo: {
        type: String,
        required: true,
        enum: ['Revision','Mantenimiento','Reparacion']
    },
    precio:{
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
}, {
    timestamps: true // Agregar timestamps de creación y modificación automáticamente
});

// Exportar el modelo 'Equipo' basado en el esquema 'equipoSchema'
export default model('Proforma', proformaSchema);