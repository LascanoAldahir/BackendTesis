import mongoose, { Schema, model } from 'mongoose'; // Importa mongoose para la definición del esquema y el modelo

// Define el esquema del paciente
const clienteSchema = new Schema({
    nombre: {
        type: String,
        required: true, // El campo es obligatorio
        trim: true // Elimina espacios en blanco al inicio y al final
    },
    cedula: {//elimine propietario
        type: Number,
        required: true,
        trim: true
    },
    telefono: {
        type: Number,
        required: true,
        trim: true
    },
    direccion: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    frecuente: {
        type: Boolean,
        require: true,
        default: false
    }


}, 
); 

export default model('Cliente', clienteSchema); // Exporta el modelo de datos del paciente
