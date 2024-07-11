import { sendMailToRecoveryPasswordCli } from "../config/nodemailer.js"; // Importa funciones para enviar correos electrónicos
import Cliente from "../models/Cliente.js"; // Importa el modelo Cliente para interactuar con la colección de pacientes en la base de datos

import { sendMailToCliente } from "../config/nodemailer.js"; // Importa la función sendMailToCliente desde el archivo nodemailer.js para enviar correos electrónicos

import mongoose from "mongoose"; // Importa mongoose para trabajar con la base de datos MongoDB
import generarJWT from "../helpers/crearJWT.js"; // Importa la func ión generarJWT desde el archivo crearJWT.js para generar tokens JWT
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const secret = 'SDFGSJDF7246782CFBKJSDF'; // Reemplaza esto con tu clave secreta real

//holi
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
      return res.status(404).json({ msg: "Lo sentimos, correo o contraseña incorrectos" });
    }

    const verificarPassword = await clienteBDD.matchPassword(password);
    if (!verificarPassword) {
      return res.status(401).json({ msg: "Lo sentimos, correo o contraseña incorrectos" });
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
const registrarCliente = async (req, res) => {
  try {
    // desestructura el correo y cédula
    const { correo, nombre, apellido, cedula } = req.body;

    // Valida todos los campos del cuerpo de la solicitud
    if (Object.values(req.body).includes(""))
      return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    // Validar que nombre y apellido solo contengan letras
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (!soloLetras.test(nombre) || !soloLetras.test(apellido))
      return res.status(400).json({
          msg: "Los campos 'nombre' y 'apellido' deben contener solo letras",
        });

    // Busca si el correo ya está registrado en la base de datos
    const verificarEmailBDD = await Cliente.findOne({ correo });
    if (verificarEmailBDD)
      return res.status(400).json({ msg: "Lo sentimos, el correo ya se encuentra registrado" });

    // Busca si la cédula ya está registrada en la base de datos
    const verificarCedulaBDD = await Cliente.findOne({ cedula });
    if (verificarCedulaBDD)
      return res.status(400).json({ msg: "Lo sentimos, la cédula ya se encuentra registrada" });

    // Crea una nueva instancia de Cliente con los datos proporcionados en el cuerpo de la solicitud
    const nuevoCliente = new Cliente(req.body);
    // Genera una contraseña aleatoria
    const password = Math.random().toString(36).slice(2);
    // Asocia el cliente con el técnico que hizo la solicitud
    nuevoCliente.tecnico = req.tecnicoBDD._id;
    // Encripta la contraseña
    nuevoCliente.password = await nuevoCliente.encryptPassword(password);
    
    // Generar y guardar el token
    const token = jwt.sign({ id: nuevoCliente._id }, secret, { expiresIn: '1d' });
    nuevoCliente.resetPasswordToken = token;
    nuevoCliente.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    // Guarda el cliente en la base de datos
    await nuevoCliente.save();

    // Envía un correo electrónico al cliente con la contraseña
    await sendMailToCliente(correo, password);

    // Responde con un mensaje de éxito
    res.status(200).json({ msg: "Registro exitoso del cliente y correo enviado" });
  } catch (error) {
    console.error("Error registrando el cliente:", error);
    res.status(500).json({ msg: "Error registrando el cliente" });
  }
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
const actualizarPasswordCli = async (req, res) => {
  try {
    const clienteBDD = await Cliente.findById(req.clienteBDD._id);
    if (!clienteBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el cliente ${id}` });

    const verificarPassword = await clienteBDD.matchPassword(req.body.passwordactual);
    if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, la contraseña actual no es correcta" });

    // Validar que la nueva contraseña con caracteres especiales.
    const passwordNuevo = req.body.passwordnuevo;
    const validarPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?=.*[a-zA-Z])[^ ]+$/;
    if (!validarPassword.test(passwordNuevo)) {
      return res.status(400).json({
        msg: "La nueva contraseña debe contener letras, números y caracteres especiales, y no debe contener espacios",
      });
    }

    clienteBDD.password = await clienteBDD.encrypPassword(passwordNuevo);
    await clienteBDD.save();
    res.status(200).json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error actualizando la contraseña:", error);
    res.status(500).json({ msg: "Ocurrió un error al intentar actualizar la contraseña" });
  }
};


//////////////////////////////////////////////////////////////////////////////
const recuperarPasswordCli = async (req, res) => {
  try {
    const { correo } = req.body;
    // Validar si el campo de correo está vacío
    if (!correo) {
      return res.status(400).json({ msg: "Debes proporcionar un correo electrónico" });
    }
    // Buscar al cliente por su correo electrónico
    const clienteBDD = await Cliente.findOne({ correo });
    // Si no se encuentra el cliente, responder con un mensaje de error
    if (!clienteBDD) {
      return res.status(404).json({ msg: "El usuario no se encuentra registrado" });
    }
    // Reutilizar el token existente
    const token = clienteBDD.crearToken();
    clienteBDD.token = token;
    await clienteBDD.save();
    await sendMailToRecoveryPasswordCli(correo, token);

    await clienteBDD.save();

    // Responder al cliente con un mensaje de éxito
    res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" });
  } catch (error) {
    // Capturar y manejar cualquier error que ocurra durante el proceso
    console.error("Error en recuperar Contraseña:", error);
    res.status(500).json({ msg: "Ocurrió un error al intentar recuperar la contraseña" });
  }
};

////////////////////////////////////////////////////////////////////////////
// Método para comprobar el token
const comprobarTokenPasswordCli = async (req, res) => {
  try {
    const { token } = req.params;
    // Verificar si el token no está presente en la solicitud
    if (!token) {
      return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    }
    // Buscar al cliente utilizando el token
    const clienteBDD = await Cliente.findOne({ token: req.params.token });
    // Si no se encuentra ningún cliente con el token proporcionado, responder con un mensaje de error
    if (!clienteBDD) {
      return res.status(400).json({ msg: "El token de recuperación es inválido o ha expirado" });
    }
    // Responder al cliente con un mensaje de éxito
    res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nueva contraseña" });
  } catch (error) {
    // Capturar y manejar cualquier error que ocurra durante el proceso
    console.error("Error en comprobarToken:", error);
    res.status(500).json({
        msg: "Ocurrió un error al intentar validar el token de recuperación",
      });
  }
};
///////////////////////////////////////////////////////////////////////////////////////
const nuevoPasswordCli = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaPassword } = req.body;

    console.log("Token recibido:", token);
    console.log("Nueva contraseña recibida:", nuevaPassword);

    // Verificar si el token no está presente en la solicitud
    if (!token) {
      console.log("El Token no encontrado en la solicitud");
      return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    }

    // Buscar al cliente utilizando el token
    const clienteBDD = await Cliente.findOne({ token: req.params.token });

    console.log("Cliente encontrado en la base de datos:", clienteBDD);

    // Mensaje de cliente no registrado, responder con un mensaje de error
    if (!clienteBDD) {
      console.log("Cliente no encontrado con el token proporcionado");
      return res.status(400).json({ msg: "El token de recuperación es inválido o ha expirado" });
    }

    // Validar que la nueva contraseña cumpla con los requisitos
    const validarPassword = /^[a-zA-Z0-9]+$/;
    if (!validarPassword.test(nuevaPassword)) {
      console.log("La nueva contraseña no cumple con los requisitos");
      return res.status(400).json({
        msg: "La nueva contraseña debe contener solo letras y números, y no debe contener espacios ni caracteres especiales",
      });
    }

    // Encriptar la nueva contraseña antes de guardarla
    clienteBDD.token = null;
    clienteBDD.password = await clienteBDD.encrypPassword(nuevaPassword);
    
    await clienteBDD.save();

    console.log("Contraseña actualizada correctamente");
    res.status(200).json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error en la nueva contraseña:", error);
    res.status(500).json({ msg: "Ocurrió un error al intentar actualizar la contraseña" });
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
  actualizarPasswordCli,
  recuperarPasswordCli,
  comprobarTokenPasswordCli,
  nuevoPasswordCli
};