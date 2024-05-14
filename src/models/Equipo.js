// Importar mongoose para la gestión de esquemas y modelos en MongoDB
import mongoose, { Schema, model } from 'mongoose';

// Definir el esquema del tratamiento
const equipoSchema = new Schema({
    // Campo para el nombre del tratamiento
    nombre: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        trim: true      // Se eliminan espacios en blanco al inicio y al final
    },
    // Campo para la descripción del tratamiento
    descripcion: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        trim: true      // Se eliminan espacios en blanco al inicio y al final
    },
    // Campo para el estado del tratamiento (activo o inactivo)
    estado: {
        type: Boolean,  // Tipo de dato: Boolean
        required: true, // Campo obligatorio
        default: true   // Valor por defecto: true
    },
    // Campo para la prioridad del tratamiento (Baja, Media, Alta)
    prioridad: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        enum: ['Baja', 'Media', 'Alta'] // Solo se permite uno de estos valores
    },
    // Campo para referenciar el paciente al que se aplica el tratamiento
    cliente: {
        type: mongoose.Schema.Types.ObjectId, // Tipo de dato: ObjectId de MongoDB
        ref: 'Cliente'                       // Referencia al modelo 'Paciente'
    }
}, {
    timestamps: true // Agregar timestamps de creación y modificación automáticamente
});

// Exportar el modelo 'Equipo' basado en el esquema 'equipoSchema'
export default model('Equipo', equipoSchema);
