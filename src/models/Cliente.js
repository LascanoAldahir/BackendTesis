import mongoose, { Schema, model } from 'mongoose'; // Importa mongoose para la definición del esquema y el modelo
// Importar bcrypt para cifrar las contraseñas
import bcrypt from "bcryptjs";
import CryptoJS from 'crypto-js';
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
    }
}, 
);

// Método para cifrar el password del cliente
clienteSchema.methods.encryptPassword = function(password) {
  const encryptedPassword = CryptoJS.AES.encrypt(password, 'secret_key').toString();
  return encryptedPassword;
}

// Método para verificar si el password ingresado es el mismo de la BDD
clienteSchema.methods.matchPassword = function(password) {
    const bytes = CryptoJS.AES.decrypt(this.password, 'secret_key');
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    return originalPassword === password;
  }
  
  clienteSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew) {
      this.password = this.encryptPassword(this.password);
    }
    next();
  });

export default model('Cliente', clienteSchema); // Exporta el modelo de datos del paciente