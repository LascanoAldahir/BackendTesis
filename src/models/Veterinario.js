// Importar el Schema y el modelo de mongoose
import { Schema, model } from 'mongoose';
// Importar bcrypt para cifrar las contraseñas
import bcrypt from "bcryptjs";

// Crear el Schema "atributos de la tabla de la BDD"
const veterinarioSchema = new Schema({
    // Campo para el nombre del veterinario
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    // Campo para el apellido del veterinario
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    // Campo para la dirección del veterinario
    direccion: {
        type: String,
        trim: true,
        default: null
    },
    // Campo para el número de teléfono del veterinario
    telefono: {
        type: Number,
        trim: true,
        default: null
    },
    // Campo para el correo electrónico del veterinario
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true // El correo electrónico debe ser único
    },
    // Campo para la contraseña cifrada del veterinario
    password: {
        type: String,
        required: true
    },
    // Campo para el estado del veterinario (activo o inactivo)
    status: {
        type: Boolean,
        default: true
    },
    // Campo para el token de confirmación del correo electrónico
    token: {
        type: String,
        default: null
    },
    // Campo para indicar si el correo electrónico del veterinario ha sido confirmado
    confirmEmail: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Agregar timestamps de creación y modificación automáticamente
});

// Método para cifrar el password del veterinario
veterinarioSchema.methods.encrypPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    const passwordEncryp = await bcrypt.hash(password, salt);
    return passwordEncryp;
};

// Método para verificar si el password ingresado es el mismo de la BDD
veterinarioSchema.methods.matchPassword = async function(password) {
    const response = await bcrypt.compare(password, this.password);
    return response;
};

// Método para crear un token 
veterinarioSchema.methods.crearToken = function() {
    const tokenGenerado = this.token = Math.random().toString(36).slice(2);
    return tokenGenerado;
};

// Crear el Modelo Veterinario "Tabla BDD" en base al esquema llamado veterinarioSchema
// Luego exportar el modelo
export default model('Veterinario', veterinarioSchema);
