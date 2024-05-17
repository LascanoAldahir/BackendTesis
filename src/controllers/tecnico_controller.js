// Importar el modelo 
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"; // Importa funciones para enviar correos electrónicos
import generarJWT from "../helpers/crearJWT.js"; // Importa la función para generar tokens JWT
import Tecnico from "../models/Tecnico.js"; // Importa el modelo de Veterinario para interactuar con la colección de veterinarios en la base de datos
import mongoose from "mongoose"; // Importa mongoose para trabajar con la base de datos MongoDB

// Método para el login
const login = async(req,res)=>{
    const {email,password} = req.body // Extrae el email y password del cuerpo de la solicitud
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Busca un tecnico en la base de datos por su email, excluyendo ciertos campos del resultado
    const tecnicoBDD = await Tecnico.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    // Verifica si el email del tecnico no ha sido confirmado
    if(tecnicoBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    // Verifica si no se encontró ningún tecnico con el email proporcionado
    if(!tecnicoBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    // Verifica si la contraseña proporcionada no coincide con la almacenada en la base de datos
    const verificarPassword = await tecnicoBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    // Genera un token JWT para el veterinario autenticado
    const token = generarJWT(tecnicoBDD._id,"tecnico")
    // Extrae algunos campos del veterinario para la respuesta
    const {nombre,apellido,ruc,telefono,_id} = tecnicoBDD
    // Responde con el token JWT y la información del veterinario
    res.status(200).json({
        token,
        nombre,
        apellido,
        ruc,
        telefono,
        _id,
        email:tecnicoBDD.email,
        rol:"tecnico"
    })
}

// Método para mostrar el perfil 
const perfil =(req,res)=>{
    // Elimina algunos campos sensibles del tecnico en la respuesta
    delete req.tecnicoBDD.token
    delete req.tecnicoBDD.confirmEmail
    delete req.tecnicoBDD.createdAt
    delete req.tecnicoBDD.updatedAt
    delete req.tecnicoBDD.__v
    // Responde con el perfil del tecnico
    res.status(200).json(req.tecnicoBDD)
}

// Método para el registro
const registro = async (req,res)=>{
    // Desestructura el email y password del cuerpo de la solicitud
    const {email,password} = req.body
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Busca en la base de datos un veterinario con el email proporcionado
    const verificarEmailBDD = await Tecnico.findOne({email})
    // Verifica si ya existe un veterinario registrado con el mismo email
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    // Crea una instancia de Tecnico con los datos proporcionados en la solicitud
    const nuevoTecnico = new Tecnico(req.body)
    // Encripta el password del nuevo veterinario
    nuevoTecnico.password = await nuevoTecnico.encrypPassword(password)
    // Crea un token para el nuevo tecnico
    const token = nuevoTecnico.crearToken()
    console.log("Token creado exitosamente");
    // Envía un correo electrónico al nuevo veterinario para confirmar su cuenta
    await sendMailToUser(email,token)
    // Guarda el nuevo veterinario en la base de datos
    await nuevoTecnico.save()
    // Responde con un mensaje indicando que revise su correo electrónico para confirmar la cuenta
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
    console.log("Controller de registro terminada");
}

// Método para confirmar el token

const confirmEmail = async(req,res)=>{
    console.log("comenzando confirmacion de token");
    // Verifica si no se proporcionó un token en los parámetros de la solicitud
    console.log("verificando si no se creo token")
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Busca un tecnico en la base de datos por el token proporcionado
    const tecnicoBDD = await Tecnico.findOne({token:req.params.token})
    console.log("Buscando tecnico mediante token ")
    // Verifica si no se encontró ningún veterinario con el token proporcionado
    if(!tecnicoBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    // Actualiza el token y el estado de confirmación de la cuenta del veterinario
    tecnicoBDD.token = null
    tecnicoBDD.confirmEmail=true
    await tecnicoBDD.save()
    console.log("Confirmacion modificada en BDD ")
    // Responde con un mensaje indicando que el token ha sido confirmado
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
    console.log("token confirmado")
}

// Método para listar veterinarios
const listarTecnicos = (req,res)=>{
    // Responde con una lista de veterinarios registrados
    res.status(200).json({res:'lista de tecnicos registrados'})
}

// Método para mostrar el detalle de un veterinario en particular
const detalleTecnico = async(req,res)=>{
    const {id} = req.params // Extrae el ID del veterinario de los parámetros de la solicitud
    // Busca un veterinario en la base de datos por su ID
    const tecnicoBDD = await Tecnico.findById(id)
    // Responde con los detalles del tecnico encontrado
    res.status(200).json(tecnicoBDD)
}

// Método para actualizar el perfil
const actualizarPerfil = async (req,res)=>{
    const {id} = req.params // Extrae el ID del tecnico de los parámetros de la solicitud
    // Verifica si el ID del tecnico es válido
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Busca un tecnico en la base de datos por su ID
    const tecnicoBDD = await Tecnico.findById(id)
    // Verifica si no se encontró ningún veterinario con el ID proporcionado
    if(!tecnicoBDD) return res.status(404).json({msg:`Lo sentimos, no existe el tecnico ${id}`})
    // Verifica si el email proporcionado en la solicitud es diferente al email actual del tecnico
    if (tecnicoBDD.email !=  req.body.email)
    {
        // Busca un tecnico en la base de datos por el nuevo email
        const tecnicoBDDMail = await Tecnico.findOne({email:req.body.email})
        // Verifica si ya existe un tecnico con el nuevo email
        if (tecnicoBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
    // Actualiza los campos del tecnico con los datos proporcionados en la solicitud, si están presentes
    tecnicoBDD.nombre = req.body.nombre || tecnicoBDD?.nombre
    tecnicoBDD.apellido = req.body.apellido  || tecnicoBDD?.apellido
    tecnicoBDD.direccion = req.body.direccion ||  tecnicoBDD?.ruc
    tecnicoBDD.telefono = req.body.telefono || tecnicoBDD?.telefono
    tecnicoBDD.email = req.body.email || tecnicoBDD?.email
    // Guarda los cambios en el perfil del tecnico
    await tecnicoBDD.save()
    // Responde con un mensaje indicando que el perfil se ha actualizado correctamente
    res.status(200).json({msg:"Perfil actualizado correctamente"})
}

// Método para actualizar el password
const actualizarPassword = async (req,res)=>{
    const tecnicoBDD = await Tecnico.findById(req.tecnicoBDD._id) // Busca el tecnico en la base de datos por su ID
    // Verifica si no se encontró ningún tecnico con el ID proporcionado
    if(!tecnicoBDD) return res.status(404).json({msg:`Lo sentimos, no existe el tecnico ${id}`})
    // Verifica si el password actual proporcionado coincide con el almacenado en la base de datos
    const verificarPassword = await tecnicoBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    // Encripta y actualiza el nuevo password del tecnico
    tecnicoBDD.password = await tecnicoBDD.encrypPassword(req.body.passwordnuevo)
    await tecnicoBDD.save()
    // Responde con un mensaje indicando que el password se ha actualizado correctamente
    res.status(200).json({msg:"Password actualizado correctamente"})
}

// Método para recuperar el password
const recuperarPassword = async(req,res)=>{
    const {email} = req.body // Extrae el email de la solicitud
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Busca un tecnico en la base de datos por su email
    const tecnicoBDD = await Tecnico.findOne({email})
    // Verifica si no se encontró ningún tecnico con el email proporcionado
    if(!tecnicoBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    // Crea un token para la recuperación del password
    const token = tecnicoBDD.crearToken()
    tecnicoBDD.token=token
    // Envía un correo electrónico al usuario con el token para reestablecer el password
    await sendMailToRecoveryPassword(email,token)
    await tecnicoBDD.save()
    // Responde con un mensaje indicando que revise su correo electrónico para reestablecer su cuenta
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}

// Método para comprobar el token de recuperación de password
const comprobarTokenPasword = async (req,res)=>{
    // Verifica si no se proporcionó ningún token en los parámetros de la solicitud
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Busca un tecnico en la base de datos por el token proporcionado
    const tecnicoBDD = await Tecnico.findOne({token:req.params.token})
    // Verifica si el token almacenado en la base de datos coincide con el proporcionado en la solicitud
    if(tecnicoBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Marca el token como nulo en la base de datos para indicar que ya ha sido utilizado
    await tecnicoBDD.save()
    // Responde con un mensaje indicando que el token ha sido confirmado y se puede crear un nuevo password
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}

// Método para crear un nuevo password después de la recuperación
const nuevoPassword = async (req,res)=>{
    const{password,confirmpassword} = req.body // Extrae el password y la confirmación del password de la solicitud
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Verifica si los passwords proporcionados coinciden
    if(password != confirmpassword) return res.status(404).json({msg:"Lo sentimos, los passwords no coinciden"})
    // Busca un tecnico en la base de datos por el token proporcionado en la solicitud
    const tecnicoBDD = await Tecnico.findOne({token:req.params.token})
    // Verifica si el token almacenado en la base de datos coincide con el proporcionado en la solicitud
    if(tecnicoBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Marca el token como nulo en la base de datos para indicar que ya ha sido utilizado
    tecnicoBDD.token = null
    // Encripta y actualiza el nuevo password del veterinario
    tecnicoBDD.password = await tecnicoBDD.encrypPassword(password)
    await tecnicoBDD.save()
    // Responde con un mensaje indicando que el nuevo password ha sido creado correctamente
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}

// Exportar cada uno de los métodos
export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarTecnicos,
    detalleTecnico,
    actualizarPerfil,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}