// Importar el modelo 
import { sendMailToUser, sendMailToRecoveryPassword } from "../config/nodemailer.js"; // Importa funciones para enviar correos electrónicos
import generarJWT from "../helpers/crearJWT.js"; // Importa la función para generar tokens JWT
import Veterinario from "../models/Veterinario.js"; // Importa el modelo de Veterinario para interactuar con la colección de veterinarios en la base de datos
import mongoose from "mongoose"; // Importa mongoose para trabajar con la base de datos MongoDB

// Método para el login
const login = async(req,res)=>{
    const {email,password} = req.body // Extrae el email y password del cuerpo de la solicitud
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Busca un veterinario en la base de datos por su email, excluyendo ciertos campos del resultado
    const veterinarioBDD = await Veterinario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
    // Verifica si el email del veterinario no ha sido confirmado
    if(veterinarioBDD?.confirmEmail===false) return res.status(403).json({msg:"Lo sentimos, debe verificar su cuenta"})
    // Verifica si no se encontró ningún veterinario con el email proporcionado
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    // Verifica si la contraseña proporcionada no coincide con la almacenada en la base de datos
    const verificarPassword = await veterinarioBDD.matchPassword(password)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    // Genera un token JWT para el veterinario autenticado
    const token = generarJWT(veterinarioBDD._id,"veterinario")
    // Extrae algunos campos del veterinario para la respuesta
    const {nombre,apellido,direccion,telefono,_id} = veterinarioBDD
    // Responde con el token JWT y la información del veterinario
    res.status(200).json({
        token,
        nombre,
        apellido,
        direccion,
        telefono,
        _id,
        email:veterinarioBDD.email,
        rol:"veterinario"
    })
}

// Método para mostrar el perfil 
const perfil =(req,res)=>{
    // Elimina algunos campos sensibles del veterinario en la respuesta
    delete req.veterinarioBDD.token
    delete req.veterinarioBDD.confirmEmail
    delete req.veterinarioBDD.createdAt
    delete req.veterinarioBDD.updatedAt
    delete req.veterinarioBDD.__v
    // Responde con el perfil del veterinario
    res.status(200).json(req.veterinarioBDD)
}

// Método para el registro
const registro = async (req,res)=>{
    // Desestructura el email y password del cuerpo de la solicitud
    const {email,password} = req.body
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Busca en la base de datos un veterinario con el email proporcionado
    const verificarEmailBDD = await Veterinario.findOne({email})
    // Verifica si ya existe un veterinario registrado con el mismo email
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
    // Crea una instancia de Veterinario con los datos proporcionados en la solicitud
    const nuevoVeterinario = new Veterinario(req.body)
    // Encripta el password del nuevo veterinario
    nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password)
    // Crea un token para el nuevo veterinario
    const token = nuevoVeterinario.crearToken()
    // Envía un correo electrónico al nuevo veterinario para confirmar su cuenta
    await sendMailToUser(email,token)
    // Guarda el nuevo veterinario en la base de datos
    await nuevoVeterinario.save()
    // Responde con un mensaje indicando que revise su correo electrónico para confirmar la cuenta
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})
}

// Método para confirmar el token
const confirmEmail = async(req,res)=>{
    // Verifica si no se proporcionó un token en los parámetros de la solicitud
    if(!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Busca un veterinario en la base de datos por el token proporcionado
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    // Verifica si no se encontró ningún veterinario con el token proporcionado
    if(!veterinarioBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    // Actualiza el token y el estado de confirmación de la cuenta del veterinario
    veterinarioBDD.token = null
    veterinarioBDD.confirmEmail=true
    await veterinarioBDD.save()
    // Responde con un mensaje indicando que el token ha sido confirmado
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"}) 
}

// Método para listar veterinarios
const listarVeterinarios = (req,res)=>{
    // Responde con una lista de veterinarios registrados
    res.status(200).json({res:'lista de veterinarios registrados'})
}

// Método para mostrar el detalle de un veterinario en particular
const detalleVeterinario = async(req,res)=>{
    const {id} = req.params // Extrae el ID del veterinario de los parámetros de la solicitud
    // Busca un veterinario en la base de datos por su ID
    const veterinarioBDD = await Veterinario.findById(id)
    // Responde con los detalles del veterinario encontrado
    res.status(200).json(veterinarioBDD)
}

// Método para actualizar el perfil
const actualizarPerfil = async (req,res)=>{
    const {id} = req.params // Extrae el ID del veterinario de los parámetros de la solicitud
    // Verifica si el ID del veterinario es válido
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Busca un veterinario en la base de datos por su ID
    const veterinarioBDD = await Veterinario.findById(id)
    // Verifica si no se encontró ningún veterinario con el ID proporcionado
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    // Verifica si el email proporcionado en la solicitud es diferente al email actual del veterinario
    if (veterinarioBDD.email !=  req.body.email)
    {
        // Busca un veterinario en la base de datos por el nuevo email
        const veterinarioBDDMail = await Veterinario.findOne({email:req.body.email})
        // Verifica si ya existe un veterinario con el nuevo email
        if (veterinarioBDDMail)
        {
            return res.status(404).json({msg:`Lo sentimos, el existe ya se encuentra registrado`})  
        }
    }
    // Actualiza los campos del veterinario con los datos proporcionados en la solicitud, si están presentes
    veterinarioBDD.nombre = req.body.nombre || veterinarioBDD?.nombre
    veterinarioBDD.apellido = req.body.apellido  || veterinarioBDD?.apellido
    veterinarioBDD.direccion = req.body.direccion ||  veterinarioBDD?.direccion
    veterinarioBDD.telefono = req.body.telefono || veterinarioBDD?.telefono
    veterinarioBDD.email = req.body.email || veterinarioBDD?.email
    // Guarda los cambios en el perfil del veterinario
    await veterinarioBDD.save()
    // Responde con un mensaje indicando que el perfil se ha actualizado correctamente
    res.status(200).json({msg:"Perfil actualizado correctamente"})
}

// Método para actualizar el password
const actualizarPassword = async (req,res)=>{
    const veterinarioBDD = await Veterinario.findById(req.veterinarioBDD._id) // Busca el veterinario en la base de datos por su ID
    // Verifica si no se encontró ningún veterinario con el ID proporcionado
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    // Verifica si el password actual proporcionado coincide con el almacenado en la base de datos
    const verificarPassword = await veterinarioBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    // Encripta y actualiza el nuevo password del veterinario
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(req.body.passwordnuevo)
    await veterinarioBDD.save()
    // Responde con un mensaje indicando que el password se ha actualizado correctamente
    res.status(200).json({msg:"Password actualizado correctamente"})
}

// Método para recuperar el password
const recuperarPassword = async(req,res)=>{
    const {email} = req.body // Extrae el email de la solicitud
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Busca un veterinario en la base de datos por su email
    const veterinarioBDD = await Veterinario.findOne({email})
    // Verifica si no se encontró ningún veterinario con el email proporcionado
    if(!veterinarioBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    // Crea un token para la recuperación del password
    const token = veterinarioBDD.crearToken()
    veterinarioBDD.token=token
    // Envía un correo electrónico al usuario con el token para reestablecer el password
    await sendMailToRecoveryPassword(email,token)
    await veterinarioBDD.save()
    // Responde con un mensaje indicando que revise su correo electrónico para reestablecer su cuenta
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}

// Método para comprobar el token de recuperación de password
const comprobarTokenPasword = async (req,res)=>{
    // Verifica si no se proporcionó ningún token en los parámetros de la solicitud
    if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Busca un veterinario en la base de datos por el token proporcionado
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    // Verifica si el token almacenado en la base de datos coincide con el proporcionado en la solicitud
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Marca el token como nulo en la base de datos para indicar que ya ha sido utilizado
    await veterinarioBDD.save()
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
    // Busca un veterinario en la base de datos por el token proporcionado en la solicitud
    const veterinarioBDD = await Veterinario.findOne({token:req.params.token})
    // Verifica si el token almacenado en la base de datos coincide con el proporcionado en la solicitud
    if(veterinarioBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    // Marca el token como nulo en la base de datos para indicar que ya ha sido utilizado
    veterinarioBDD.token = null
    // Encripta y actualiza el nuevo password del veterinario
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
    await veterinarioBDD.save()
    // Responde con un mensaje indicando que el nuevo password ha sido creado correctamente
    res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 
}

// Exportar cada uno de los métodos
export {
    login,
    perfil,
    registro,
    confirmEmail,
    listarVeterinarios,
    detalleVeterinario,
    actualizarPerfil,
    actualizarPassword,
	recuperarPassword,
    comprobarTokenPasword,
	nuevoPassword
}
