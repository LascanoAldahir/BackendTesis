import { sendMailToRecoveryPasswordCli } from "../config/nodemailer.js"; // Importa funciones para enviar correos electrónicos
// IMPORTAR EL MODELO
import Cliente from "../models/Cliente.js"; // Importa el modelo Cliente para interactuar con la colección de pacientes en la base de datos

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

//------------------------------------------------------------------------------------------------------
// Método para el proceso de login

const loginCliente = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const clienteBDD = await Cliente.findOne({ correo });
    if (!clienteBDD) {
      return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    }

    const verificarPassword = await clienteBDD.matchPassword(password);
    if (!verificarPassword) {
      return res.status(401).json({ msg: "Lo sentimos, correo o password incorrectos" });
    }

    const token = generarJWT(clienteBDD._id, "cliente");
    const { nombre, _id, cedula, telefono, frecuente, tecnico } = clienteBDD;

    return res.status(200).json({
      token,
      nombre,
      correo,
      telefono,
      frecuente,
      tecnico,
      rol: "cliente",
      _id,
      cedula // Incluyendo cedula en la respuesta
    });
  } catch (error) {
    console.error("Error en el proceso de login: ", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};


//----------------------------------------------------------------------------------------------------


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
      .select("nombre correo telefono cedula frecuente direccion password")
      .populate("tecnico", "_id nombre");
    res.status(200).json(clientes);
  } else {
    // Si no es propietario, busca pacientes asociados al veterinarioBDD que hizo la solicitud
    const clientes = await Cliente.find({ estado: true })
      .where("tecnico")
      .equals(req.tecnicoBDD)
      .select("nombre correo telefono cedula frecuente direccion password")
      .populate("tecnico", "_id nombre");
    res.status(200).json(clientes);
  }
};

// Método para ver el detalle de un paciente en particular
const detalleCliente = async (req, res) => {
  const { id } = req.params; // Extrae el ID del paciente de los parámetros de la solicitud
  // Verifica si el ID es válido
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no existe el cliente ${id}" });
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
////////////////////////////////////////////////////////////////////////////////////////////
// Método para registrar un paciente
const registrarCliente = async (req, res) => {
  // desestructura el email
  const {correo} = req.body
  // Valida todos los campos del cuerpo de la solicitud
  if (Object.values(req.body).includes(""))
    return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
  // Busca si el email ya está registrado en la base de datos
  const verificarEmailBDD = await Cliente.findOne({correo})
  // Si el email ya está registrado, responde con un mensaje de error
  if (verificarEmailBDD)
    return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
  // Crea una nueva instancia de Paciente con los datos proporcionados en el cuerpo de la solicitud
  const nuevoCliente = new Cliente(req.body);
  // Genera una contraseña aleatoria
  const password = Math.random().toString(36).slice(2)
    // Asocia el paciente con el tecnico que hizo la solicitud
  nuevoCliente.tecnico=req.tecnicoBDD._id
  // Guarda el cliente en la base de datos
  
  // Envía un correo electrónico al cliente con la contraseña
  await sendMailToCliente(correo,password)
  // Encripta la contraseña
  nuevoCliente.password = await nuevoCliente.encryptPassword(password)
  // Responde con un mensaje de éxito
  await nuevoCliente.save()
  res.status(200).json({ msg: "Registro exitoso del paciente y correo enviado" });
};
///////////////////////////////////////////////////////////////////////////////////////
// Método para actualizar un cliente
const actualizarCliente = async (req, res) => {
  const { id } = req.params; // Extrae el ID del paciente de los parámetros de la solicitud
  // Verifica si algún campo del cuerpo de la solicitud está vacío
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  // Verifica si el ID del paciente es válido
  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no existe el cliente ${id}" });
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
      return res.status(404).json({ msg: "Lo sentimos, no existe el cliente ${id}" });
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
const recuperarPasswordCli = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const clienteBDD = await Cliente.findOne({ correo });
    if (!clienteBDD) {
      return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
    }

    const token = clienteBDD.crearToken();
    clienteBDD.token = token;
    
    await sendMailToRecoveryPasswordCli(correo, token);
    await clienteBDD.save();
    
    return res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
  } catch (error) {
    console.error("Error al recuperar el password: ", error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};


// Método para comprobar el token
const comprobarTokenPaswordCli = async (req, res) => {
  if (!req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  const tecnicoBDD = await Tecnico.findOne({ token: req.params.token });
  if (tecnicoBDD?.token !== req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" });
  await tecnicoBDD.save();
  res
    .status(200)
    .json({ msg: "Token confirmado, ya puedes crear tu nuevo password" });
};

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
  comprobarTokenPaswordCli,
};
