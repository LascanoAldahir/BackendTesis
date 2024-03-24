import mongoose, { Schema, model } from 'mongoose'; // Importa mongoose para la definición del esquema y el modelo
import bcrypt from "bcryptjs"; // Importa bcrypt para el cifrado de contraseñas

// Define el esquema del paciente
const pacienteSchema = new Schema({
    nombre: {
        type: String,
        required: true, // El campo es obligatorio
        trim: true // Elimina espacios en blanco al inicio y al final
    },
    propietario: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    celular: {
        type: String,
        required: true,
        trim: true
    },
    convencional: {
        type: String,
        required: true,
        trim: true
    },
    ingreso: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now() // Valor por defecto: fecha y hora actual
    },
    sintomas: {
        type: String,
        required: true,
        trim: true
    },
    salida: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now() // Valor por defecto: fecha y hora actual
    },
    estado: {
        type: Boolean,
        default: true // Valor por defecto: true
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId, // Tipo de dato: ObjectId
        ref: 'Veterinario' // Referencia al modelo de datos del veterinario
    }
}, {
    timestamps: true // Añade timestamps automáticos de creación y actualización
});

// Método para cifrar la contraseña del paciente antes de guardarla en la base de datos
pacienteSchema.methods.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10); // Genera un salt (valor aleatorio)
    const encryptedPassword = await bcrypt.hash(password, salt); // Aplica el cifrado bcrypt a la contraseña
    return encryptedPassword; // Retorna la contraseña cifrada
};

// Método para verificar si la contraseña ingresada coincide con la almacenada en la base de datos
pacienteSchema.methods.matchPassword = async function(password) {
    const result = await bcrypt.compare(password, this.password); // Compara las contraseñas
    return result; // Retorna true si coinciden, false en caso contrario
};

export default model('Paciente', pacienteSchema); // Exporta el modelo de datos del paciente
