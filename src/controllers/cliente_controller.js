
import { sendMailToRecoveryPasswordCli } from "../config/nodemailer.js"; // Importa funciones para enviar correos electrónicos
// IMPORTAR EL MODELO

import Cliente from "../models/Cliente.js"; // Importa el modelo Cliente para interactuar con la colección de pacientes en la base de datos
import Ordentrabajo from "../models/Ordentrabajo.js"; // Importa el modelo Equipo para interactuar con la colección de tratamientos en la base de datos

// IMPORTAR EL MÉTODO sendMailToPaciente
import { sendMailToCliente } from "../config/nodemailer.js"; // Importa la función sendMailToCliente desde el archivo nodemailer.js para enviar correos electrónicos

import mongoose from "mongoose"; // Importa mongoose para trabajar con la base de datos MongoDB
import generarJWT from "../helpers/crearJWT.js"; // Importa la función generarJWT desde el archivo crearJWT.js para generar tokens JWT
import Tecnico from "../models/Tecnico.js";

// Buscar cliente por cedula
const buscarClientePorCedula = async (req, res) => {
  const { cedula } = req.params;
  try {
    const cliente = await Cliente.findOne({ cedula });
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar el cliente" });
  }
};

// Método para el proceso de login
const loginCliente = async (req, res) => {
  const { cedula, password } = req.body; // Extrae el correo y la contraseña del cuerpo de la solicitud
  // Verifica si algún campo del cuerpo de la solicitud está vacío
  if (Object.values(req.body).includes(""))
    return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
  // Busca un paciente en la base de datos por su correo
  const clienteBDD = await Cliente.findOne({ cedula });
  // Si no se encuentra ningún paciente con el correo proporcionado, responde con un mensaje de error
  if (!clienteBDD)
    return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
  // Comprueba si la contraseña proporcionada coincide con la contraseña almacenada para el paciente en la base de datos
  const verificarPassword = await clienteBDD.matchPassword(password);
  // Si la contraseña no coincide, responde con un mensaje de error
  if (!verificarPassword)
    return res.status(404).json({ msg: "Lo sentimos, el password no es el correcto" });
  // Genera un token JWT para el cliente
  const token = generarJWT(clienteBDD._id, "cliente");
  // Extrae algunos datos específicos del cliente para incluir en la respuest
  const {
    nombre,
    propietario,
    correo: correolP,
    celular,
    frecuente,
    _id,
  } = clienteBDD;

  // Responde con un objeto JSON que contiene el token JWT y otros datos del cliente
  res.status(200).json({
    token,
    nombre,
    correolP,
    password,
    propietario,
    correoP,
    celular,
    telefono,
    frecuente,
    rol: "cliente",
    _id,
  });
};

// Método para ver el perfil
const perfilCliente = (req, res) => {
  // Elimina algunos campos sensibles del objeto pacienteBDD antes de responder
  delete req.clienteBDD.ingreso;
  delete req.clienteBDD.detalle;
  delete req.clienteBDD.salida;
  delete req.clienteBDD.estado;
  delete req.clienteBDD.tecnico;
  delete req.clienteBDD.createdAt;
  delete req.clienteBDD.updatedAt;
  delete req.clienteBDD.__v;
  // Responde con el perfil del cliente (sin los campos eliminados)
  res.status(200).json(req.clienteBDD);
};

// Método para listar pacientes
const listarClientes = async (req, res) => {
  // Verifica si la solicitud coniene datos de clienteBDD
  if (req.clienteBDD && "propietario" in req.clienteBDD) {
    // Si el pacienteBDD existe y es propietario, busca pacientes asociados a ese propietario
    const clientes = await Cliente.find(req.clienteBDD._id)
      .select("nombre correo telefono cedula frecuente direccion")
      .populate("tecnico", "_id nombre");
    res.status(200).json(clientes);
  } else {
    // Si no es propietario, busca pacientes asociados al veterinarioBDD que hizo la solicitud
    const clientes = await Cliente.find({ estado: true })
      .where("tecnico")
      .equals(req.tecnicoBDD)
      .select("nombre correo telefono cedula frecuente direccion")
      .populate("tecnico", "_id nombre");
    res.status(200).json(clientes);
  }
};

// Método para ver el detalle de un paciente en particular
const detalleCliente = async (req, res) => {
  const { id } = req.params; // Extrae el ID del paciente de los parámetros de la solicitud
  // Verifica si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: 'Lo sentimos, no existe el cliente ${id}' });
  // Busca al cliente por su ID y lo popula con la información del tecnico asociado y los equipos asociados
  const cliente = await Cliente.findById(id)
    .select("")
    .populate("tecnico", "_id nombre apellido");
  // const equipos = await Equipos.find({estado:true}).where('cliente').equals(id)
  // Responde con el detalle del cliente y sus equipos
  res.status(200).json({
    cliente,
  });
};

const registrarCliente = async (req, res) => {
  try {
      // Desestructurar los datos recibidos
      const { correo, cedula } = req.body; // Extraemos correo y cédula

      // Generar una contraseña aleatoria
      const password = Math.random().toString(36).slice(2); // Generamos la contraseña aleatoria
      
      // Crear una nueva instancia de Cliente con la cédula y correo
      const nuevoCliente = new Cliente({ cedula, correo });

      // Encriptar el password
      nuevoCliente.password = await nuevoCliente.encrypPassword("tec" + password);
      
      // Guardar el cliente en la base de datos
      await nuevoCliente.save();

      // Enviar el correo electrónico al cliente con la cédula y la contraseña
      await sendMailToCliente(correo, cedula, password); // Se usa el correo para enviar el mensaje
      
      // Asociar el cliente con el técnico
      nuevoCliente.tecnico = req.tecnicoBDD._id;

      // Responder con éxito
      res.status(200).json({ msg: "Registro exitoso del cliente y correo enviado" });
  } catch (error) {
      console.error("Error al registrar cliente: ", error);
      res.status(500).json({ msg: "Error al registrar cliente" });
  }
};



// Método para actualizar un paciente
const actualizarCliente = async (req, res) => {
  const { id } = req.params; // Extrae el ID del paciente de los parámetros de la solicitud
  // Verifica si algún campo del cuerpo de la solicitud está vacío
  if (Object.values(req.body).includes(""))
    return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
  // Verifica si el ID del paciente es válido
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: 'Lo sentimos, no existe el cliente ${id}' });
  // Busca y actualiza el paciente en la base de datos utilizando el ID proporcionado
  await Cliente.findByIdAndUpdate(req.params.id, req.body);
  // Responde con un mensaje de éxito
  res.status(200).json({ msg: "Actualización exitosa del cliente" });
};


// Método para eliminar(dar de baja) un paciente
const eliminarCliente = async (req, res) => {
  const { id } = req.params; // Extrae el ID del cliente de los parámetros de la solicitud
  try {
    // Verifica si el ID del cliente es válido
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: 'Lo sentimos, no existe el cliente ${id}' });
    // Elimina el cliente de la base de datos
    await Cliente.findByIdAndDelete(id);
    // Responde con un mensaje de éxito
    res.status(200).json({ msg: "Cliente eliminado exitosamente" });
  } catch (error) {
    // Si ocurre un error, responde con un mensaje de error
    console.error(error);
    res.status(500).json({ msg: "Ocurrió un error al intentar eliminar al cliente" });
  }
};

// Método para recuperar el password
const recuperarPasswordCli = async(req,res)=>{
  const {cedula} = req.body
  if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
  const clienteBDD = await Cliente.findOne({cedula})
  if(!tecnicoBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
  const token = tecnicoBDD.crearToken()
  tecnicoBDD.token=token
  await sendMailToRecoveryPasswordCli(cedula,token)
  await tecnicoBDD.save()
  res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}


// Método para comprobar el token
const comprobarTokenPaswordCli = async (req,res)=>{
  if(!(req.params.token)) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
  const tecnicoBDD = await Tecnico.findOne({token:req.params.token})
  if(tecnicoBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
  await tecnicoBDD.save()
  res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}

//modelo de orden (no borrar sino poner finalizado)

// Exporta los métodos de la API relacionados con la gestión de pacientes
export {
  loginCliente,
  perfilCliente,
  buscarClientePorCedula,
  listarClientes,
  detalleCliente,
  registrarCliente,
  actualizarCliente,
  eliminarCliente,
  recuperarPasswordCli,
  comprobarTokenPaswordCli
};