// Importar mongoose
import mongoose from 'mongoose'; // Importa el módulo mongoose para interactuar con la base de datos MongoDB

// Permitir que solo los campos definidos en el Schema sean almacenados en la base de datos
mongoose.set('strictQuery', true);

// Crear una función llamada connection()
const connection = async () => {
    try {
        // Establecer la conexión con la base de datos utilizando la URL proporcionada en la variable de entorno MONGODB_URI
        const { connection } = await mongoose.connect(process.env.MONGODB_URI);
        
        // Presentar la conexión en consola 
        console.log(`Database is connected on ${connection.host} - ${connection.port}`);
    
    } catch (error) {
        // Capturar error en la conexión y presentarlo en consola
        console.log(error);
    }
}

// Exportar la función para que pueda ser utilizada en otros archivos
export default connection;
