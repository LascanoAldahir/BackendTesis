//holi.jj
import nodemailer from "nodemailer"; // Importa el módulo nodemailer para enviar correos electrónicos
import dotenv from 'dotenv'; // Importa el módulo dotenv para cargar variables de entorno desde un archivo '.env'
import Cliente from "../models/Cliente.js";
dotenv.config(); // Carga las variables de entorno desde el archivo .env

// Configura el transporte de correo con los datos proporcionados en las variables de entorno
let transporter = nodemailer.createTransport({
    service: 'gmail', // Servicio de correo electrónico a utilizar (en este caso, Gmail)
    host: process.env.HOST_MAILTRAP, // Host del servicio de correo electrónico (obtenido de las variables de entorno)
    port: process.env.PORT_MAILTRAP, // Puerto del servicio de correo electrónico (obtenido de las variables de entorno)
    auth: {
        user: process.env.USER_MAILTRAP, // Nombre de usuario del servicio de correo electrónico (obtenido de las variables de entorno)
        pass: process.env.PASS_MAILTRAP, // Contraseña del servicio de correo electrónico (obtenida de las variables de entorno)
    }
});


// Función para enviar un correo electrónico de verificación al usuario
const sendMailToUser = async (userMail, token) => {
    // let es una variable que ouede cambiar por eso no es const
    let info = await transporter.sendMail({
        from: 'info@electronica_zurita.com', // Dirección de correo electrónico del remitente
        to: userMail, // Dirección de correo electrónico del destinatario
        subject: "Verifica tu cuenta de correo electrónico", // Asunto del correo electrónico
        html: `
        <h1>Sistema de gestión (💻🖱️ Electrónica Zurita 🔌🎧)</h1>
        <hr>
        <a href=${process.env.URL_FRONTEND}/confirmar/${token}>Clic para confirmar tu cuenta</a>
        <hr>
        <footer>Electronica Zurita te dá la bienvenida!</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId); // Imprime el ID del mensaje enviado satisfactoriamente en consola
}

// Función para enviar un correo electrónico de recuperación de contraseña al usuario
const sendMailToRecoveryPassword = async (userMail, token) => {
    let info = await transporter.sendMail({
        from: 'electronica_zurita@admin.com',
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <h1>Sistema de gestión (💻🖱️ Electrónica Zurita 🔌🎧)</h1>
        <hr>
        <a href=${process.env.URL_FRONTEND}/recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
        <hr>
        <footer>Electronica Zurita te dá la bienvenida!</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

/////////////////////////////////////////////////////////////

// Función para enviar un correo electrónico de recuperación de contraseña al usuario
const sendMailToRecoveryPasswordCli = async (userMail, token) => {
    let info = await transporter.sendMail({
        from: 'electronica_zurita@admin.com',
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <h1>Sistema de gestión (💻🖱️ Electrónica Zurita 🔌🎧)</h1>
        <hr>
        <a href=${process.env.URL_FRONTEND}/recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
        <hr>
        <footer>Electronica Zurita te dá la bienvenida!</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}


/////////////////////////////////////////////////////////////
// Función para enviar un correo electrónico de bienvenida al cliente
const sendMailToCliente = async(userMail,password)=>{
    let info = await transporter.sendMail({
    from: 'electronica_zurita@admin.com',
    to: userMail,
    subject: "Correo de bienvenida",
    html: `
    <h1>Sistema de gestión (💻🖱️ Electrónica Zurita 🔌🎧)</h1>
    <hr>
    <p>Usuario de acceso: ${userMail}</p>
    
    <p>Contraseña de acceso: ${password}</p>
    <hr>
    <footer>Te damos la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);

}
/////////////////////////////////////////////////////////////
// Función para enviar un correo electrónico de bienvenida al cliente
const sendOrderFinalizadoToCliente = async(userMail,numOrder,equipo)=>{
    let info = await transporter.sendMail({
    from: 'electronica_zurita@admin.com',
    to: userMail,
    subject: "Correo de ingreso de orden",
    html: `
    <h1>Sistema de gestión (💻🖱️ Electrónica Zurita 🔌🎧)</h1>
    <hr>
    <p>Estimado usuario</p>
    <p>El proceso de su equipo: ${equipo} con el numero de orden ${numOrder} a finalizado con exito.</p>
    
    <footer>Puedes hacer un seguimiento del proceso en nuestra aplicación</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

/////////////////////////////////////////////////////////////
// Función para enviar un correo electrónico de bienvenida al cliente
const sendOrderToCliente = async(userMail,numOrder,equipo)=>{
    let info = await transporter.sendMail({
    from: 'electronica_zurita@admin.com',
    to: userMail,
    subject: "Correo de ingreso de orden",
    html: `
    <h1>Sistema de gestión (💻🖱️ Electrónica Zurita 🔌🎧)</h1>
    <hr>
    <p>Estimado usuario</p>
    <p>La orden de trabajo de su equipo: ${equipo} ha sido generada exitosamente.</p>
    <hr>
    <p>Su número de orden es: ${numOrder} </p>
    <footer>Puedes hacer un seguimiento del proceso en nuestra aplicación</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}


/////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////
// Función para enviar un correo electrónico de bienvenida al cliente
const sendOrderEnProcesoToCliente = async(userMail,numOrder,equipo)=>{
    let info = await transporter.sendMail({
    from: 'electronica_zurita@admin.com',
    to: userMail,
    subject: "Correo de ingreso de orden",
    html: `
    <h1>Sistema de gestión (💻🖱️ Electrónica Zurita 🔌🎧)</h1>
    <hr>
    <p>Estimado usuario ${Cliente}</p>
    <p>El proceso a realizar en su equipo: ${equipo} con el numero de orden ${numOrder} está en proceso.</p>
    
    <footer>Puedes hacer un seguimiento del proceso en nuestra aplicación</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}


////////////////////////////////////////////////////////////////


// Exporta las funciones para que puedan ser utilizadas en otros archivos
export {
    sendMailToUser,
    sendMailToRecoveryPassword,
    sendMailToCliente,
    sendMailToRecoveryPasswordCli,
    sendOrderFinalizadoToCliente,
    sendOrderEnProcesoToCliente,
    sendOrderToCliente
}
