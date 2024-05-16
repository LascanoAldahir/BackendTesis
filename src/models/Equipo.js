// Importar mongoose para la gestión de esquemas y modelos en MongoDB
import mongoose, { Schema, model } from 'mongoose';
// Importar bcrypt para cifrar las contraseñas
import bcrypt from "bcryptjs";

// Definir el esquema del tratamiento
const equipoSchema = new Schema({
    // Campo para el nombre del tratamiento
    tipo: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        trim: true      // Se eliminan espacios en blanco al inicio y al final
    },
    // Campo para la descripción del tratamiento
    marca: {
        type: String,   // Tipo de dato: String
        required: true, // Campo obligatorio
        trim: true      // Se eliminan espacios en blanco al inicio y al final
    },
    // Campo para el estado del tratamiento (activo o inactivo)
    modelo : {
        type: String,  
        required: true, // Campo obligatorio
        default: true   // Valor por defecto: true
    },
    // Campo para la prioridad del tratamiento (Baja, Media, Alta)
    serie: {
        type: String,  
        required: true, // Campo obligatorio
        default: true  
    },
    // Campo para referenciar el paciente al que se aplica el tratamiento
    color: {
        type: String,
        required: true, // Campo obligatorio
        default: true   // Valor por defecto: true
    },
    tipoServicio: {
        type: String,
        required: true,
        enum: ['Revision','Mantenimiento','Reparacion']
    },
        //frecuente, apellido, frecuente(booleano)
        ingreso: {
            type: Date,
            required: true,
            trim: true,
            default: Date.now() // Valor por defecto: fecha y hora actual
        },
        salida: {
            type: Date,
            required: true,
            trim: true,
            default: Date.now() // Valor por defecto: fecha y hora actual
        },
}, {
    timestamps: true // Agregar timestamps de creación y modificación automáticamente
});

// Exportar el modelo 'Equipo' basado en el esquema 'equipoSchema'
export default model('Equipo', equipoSchema);