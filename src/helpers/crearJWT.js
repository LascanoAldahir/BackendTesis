import jwt from "jsonwebtoken";

// Función para generar un JSON Web Token (JWT) con el ID y el rol proporcionados
const generarJWT = (id, rol) => {
    // Genera un JWT con el ID y el rol, utilizando el secreto JWT definido en las variables de entorno
    // y configurando su expiración en 1 día
    console.log("Valor de JWT_SECRET:", process.env.JWT_SECRET);

    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

export default generarJWT; // Exporta la función de generación de JWT
