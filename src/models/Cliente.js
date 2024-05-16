import mongoose, { Schema, model } from 'mongoose'; // Importa mongoose para la definición del esquema y el modelo
// Importar bcrypt para cifrar las contraseñas
import bcrypt from "bcryptjs";
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
    },
    tecnico: {
        type: Schema.Types.ObjectId,
        ref: 'Tecnico' // Nombre del modelo Tecnico
    }
}, 
);

// Método para cifrar el password del paciente
clienteSchema.methods.encryptPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}

// Método para verificar si el password ingresado es el mismo de la BDD
clienteSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}

export default model('Cliente', clienteSchema); // Exporta el modelo de datos del paciente