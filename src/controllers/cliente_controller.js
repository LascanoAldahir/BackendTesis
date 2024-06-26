import { sendMailToRecoveryPasswordCli } from "../config/nodemailer.js"; // Importa funciones para enviar correos electrónicos
import CryptoJS from 'crypto-js';

import Cliente from "../models/Cliente.js"; // Importa el modelo Cliente para interactuar con la colección de pacientes en la base de datos

import { sendMailToCliente } from "../config/nodemailer.js"; // Importa la función sendMailToCliente desde el archivo nodemailer.js para enviar correos electrónicos
import { enviarCorreo } from "../config/nodemailer.js"; // Asegúrate de tener esta función correctamente definida e importada
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
      return res
        .status(400)
        .json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    const clienteBDD = await Cliente.findOne({ correo });
    if (!clienteBDD) {
      return res
        .status(404)
        .json({ msg: "Lo sentimos, correo o contraseña incorrectos" });
    }

    const verificarPassword = await clienteBDD.matchPassword(password);
    if (!verificarPassword) {
      return res
        .status(401)
        .json({ msg: "Lo sentimos, correo o contraseña incorrectos" });
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
      cedula, // Incluyendo cedula en la respuesta
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
////////////////////////////////////////////////////////////////////////
// Método para listar pacientes
const listarClientes = async (req, res) => {
  try {
    // Busca todos los clientes en la base de datos
    const clientes = await Cliente.find({})
      .select("nombre correo telefono cedula frecuente direccion password")
      .populate("tecnico", "_id nombre");

    res.status(200).json(clientes);
  } catch (error) {
    // Maneja cualquier error que ocurra durante la búsqueda
    res.status(500).json({ mensaje: "Error al listar los clientes", error });
  }
};
////////////////////////////////////////////////////////////////////////
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
// Método para registrar un cliente
const registrarCliente = async (req, res) => {
  // desestructura el correo y cédula
  const { correo, nombre, apellido, cedula } = req.body;

  // Valida todos los campos del cuerpo de la solicitud
  if (Object.values(req.body).includes(""))
    return res
      .status(400)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });

  // Validar que nombre y apellido solo contengan letras
  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!soloLetras.test(nombre) || !soloLetras.test(apellido))
    return res
      .status(400)
      .json({
        msg: "Los campos 'nombre' y 'apellido' deben contener solo letras",
      });

  // Busca si el correo ya está registrado en la base de datos
  const verificarEmailBDD = await Cliente.findOne({ correo });
  if (verificarEmailBDD)
    return res
      .status(400)
      .json({ msg: "Lo sentimos, el correo ya se encuentra registrado" });

  // Busca si la cédula ya está registrada en la base de datos
  const verificarCedulaBDD = await Cliente.findOne({ cedula });
  if (verificarCedulaBDD)
    return res
      .status(400)
      .json({ msg: "Lo sentimos, la cédula ya se encuentra registrada" });

  // Crea una nueva instancia de Cliente con los datos proporcionados en el cuerpo de la solicitud
  const nuevoCliente = new Cliente(req.body);
  // Genera una contraseña aleatoria
  const password = Math.random().toString(36).slice(2);
  // Asocia el cliente con el técnico que hizo la solicitud
  nuevoCliente.tecnico = req.tecnicoBDD._id;

  // Envía un correo electrónico al cliente con la contraseña
  await sendMailToCliente(correo, password);
  // Encripta la contraseña
  nuevoCliente.password = await nuevoCliente.encryptPassword(password);
  // Guarda el cliente en la base de datos
  await nuevoCliente.save();

  // Responde con un mensaje de éxito
  res
    .status(200)
    .json({ msg: "Registro exitoso del cliente y correo enviado" });
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
////////////////////////////////////////////////////////////////////////
// Método para eliminar(dar de baja) un paciente
const eliminarCliente = async (req, res) => {
  const { id } = req.params; // Extrae el ID del cliente de los parámetros de la solicitud
  try {
    // Verifica si el ID del cliente es válido
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(404)
        .json({ msg: "Lo sentimos, no existe el cliente ${id}" });
    // Elimina el cliente de la base de datos
    await Cliente.findByIdAndDelete(id);
    // Responde con un mensaje de éxito
    res.status(200).json({ msg: "Cliente eliminado exitosamente" });
  } catch (error) {
    // Si ocurre un error, responde con un mensaje de error
    console.error(error);
    res
      .status(500)
      .json({ msg: "Ocurrió un error al intentar eliminar al cliente" });
  }
};
////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////
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
    .json({ msg: "Token confirmado, ya puedes crear tu nueva contraseña" });
};

//////////////////////////////////////////////////////////////////////////////
const recuperarContraCli = async (req, res) => {
  const { correo } = req.body;

  try {
    const cliente = await Cliente.findOne({ correo });

    if (!cliente) {
      return res.status(404).json({ msg: "Correo no encontrado" });
    }

    // Desencriptar la contraseña
    const originalPassword = cliente.decryptPassword();

    const asunto = "Recuperación de Contraseña";
    const mensaje = `Hola ${cliente.nombre},\n\nTus credenciales son las siguientes:\n\nCorreo: ${cliente.correo}\nContraseña: ${originalPassword}\n\nSi no solicitaste esta recuperación, por favor ignora este correo.`;

    await enviarCorreo(cliente.correo, asunto, mensaje);

    res.status(200).json({ msg: "Correo de recuperación enviado exitosamente" });
  } catch (error) {
    console.error("Error al recuperar la contraseña: ", error);
    res.status(500).json({ msg: "Error al recuperar la contraseña" });
  }
};
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
  comprobarTokenPaswordCli,
  recuperarContraCli
};
