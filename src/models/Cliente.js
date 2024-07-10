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
        required: true  
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
    },
    token: { 
        type: String },
  tokenExpires: { 
    type: Date },
}, 
);

// Método para cifrar el password del cliente
ClienteSchema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };

// Método para verificar si el password ingresado es el mismo de la BDD
ClienteSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  const Cliente = mongoose.model('Cliente', ClienteSchema);

export default model('Cliente', clienteSchema); // Exporta el modelo de datos del paciente