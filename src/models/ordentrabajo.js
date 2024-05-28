// Importar mongoose para la gestión de esquemas y modelos en MongoDB
import mongoose, { Schema, model } from 'mongoose';
// Importar bcrypt para cifrar las contraseñas
import bcrypt from "bcryptjs";

// Definir el esquema del tratamiento
const ordentrabajoSchema = new Schema({
    // Campo para el nombre del tratamiento
    numOrden:{
        type:String,
        required: true,
    },
    equipo: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        trim: true      // Se eliminan espacios en blanco al inicio y al final
    },
    // Campo para la descripción del tratamiento
    modelo: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        trim: true      // Se eliminan espacios en blanco al inicio y al final
    },
    // Campo para el estado del tratamiento (activo o inactivo)
    marca: {
        type: String,  
        required: true, // Campo obligatorio
        default: true,
        trim: true
    },
    // Campo para la prioridad del tratamiento (Baja, Media, Alta)
    serie: {
        type: String,  
        required: true, // Campo obligatorio
        default: true,
        trim: true  
    },
    // Campo para referenciar el paciente al que se aplica el tratamiento
    color: {
        type: String,
        required: true, // Campo obligatorio
        default: true   // Valor por defecto: true
    },
    ingreso: {
            type: Date,
            required: true,
            trim: true,
            default: Date.now() // Valor por defecto: fecha y hora actual
   },
   razon:{
    type: String,
        required: [true, 'La razón es obligatoria'],
        minlength: [10, 'La razón debe tener al menos 10 caracteres'],
        maxlength: [500, 'La razón no puede exceder los 500 caracteres']
    },
    fechaSalida:{
            type: Date,
            required: true,
            trim: true,
            default: Date.now() // Valor por defecto: fecha y hora actual    
    },
    servicio: {
        type: [String],
        required: true,
        enum: {
            values: ['mantenimiento', 'revisión', 'reparación'],
            message: '{VALUE} no es un servicio válido'
        }
    },
    estado:{
        type:String,
        required: true,
        default: "pendiente"
    },
    cliente: {
            type: Schema.Types.ObjectId,
            ref: 'Tecnico' // Nombre del modelo Tecnico
    },
    tecnico: {
            type: Schema.Types.ObjectId,
            ref: 'Tecnico' // Nombre del modelo Tecnico
    }
}, {
    timestamps: true // Agregar timestamps de creación y modificación automáticamente
});

// Exportar el modelo 'Equipo' basado en el esquema 'equipoSchema'
export default model('Ordentrabajo', ordentrabajoSchema);