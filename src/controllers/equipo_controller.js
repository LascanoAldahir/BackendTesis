import mongoose from "mongoose"; // Importa mongoose para trabajar con la base de datos MongoDB
import ELquipo from "../models/Equipo.js"; // Importa el modelo Tratamiento para interactuar con la colección de tratamientos en la base de datos
import Equipo from "../models/Equipo.js";

// Método para ver el detalle del tratamiento
const detalleEquipo = async(req,res)=>{
    const {id} = req.params // Extrae el ID del tratamiento de los parámetros de la solicitud
    // Verifica si el ID del tratamiento es válido
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe ese equipo`});
    // Busca el equipo por su ID y lo popula con la información del paciente asociado
    const equipo = await Equipo.findById(id).populate('cliente','_id nombre')
    // Responde con el detalle del equipo
    res.status(200).json(equipo)
}

// Método para crear el equipo
const registrarEquipo = async (req,res)=>{
    const {paciente} = req.body // Extrae el ID del paciente del cuerpo de la solicitud
    // Verifica si el ID del paciente es válido
    if( !mongoose.Types.ObjectId.isValid(paciente) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    // Crea un nuevo tratamiento con los datos proporcionados en el cuerpo de la solicitud
    const tratamiento = await Tratamiento.create(req.body)
    // Responde con un mensaje de éxito y el tratamiento creado
    res.status(200).json({msg:`Registro exitoso del tratamiento ${tratamiento._id}`,tratamiento})
}

//metodo para elegir tipo de trabajo a realizar.


// Método para actualizar el tratamiento
const actualizarEquipo = async(req,res)=>{
    const {id} = req.params // Extrae el ID del tratamiento de los parámetros de la solicitud
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Verifica si el ID del tratamiento es válido
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el tratamiento ${id}`})
    // Busca y actualiza el tratamiento en la base de datos utilizando el ID proporcionado
    await Tratamiento.findByIdAndUpdate(req.params.id,req.body)
    // Responde con un mensaje de éxito
    res.status(200).json({msg:"Actualización exitosa del tratamiento"})
}

// Método para eliminar el tratamiento
const eliminarEquipo = async(req,res)=>{
    const {id} = req.params // Extrae el ID del tratamiento de los parámetros de la solicitud
    // Verifica si algún campo del cuerpo de la solicitud está vacío
    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    // Verifica si el ID del tratamiento es válido
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe ese tratamiento`})
    // Busca y elimina el tratamiento de la base de datos utilizando el ID proporcionado
    await Tratamiento.findByIdAndDelete(req.params.id)
    // Responde con un mensaje de éxito
    res.status(200).json({msg:"Tratamiento eliminado exitosamente"})
}

// Método para cambiar el estado del tratamiento
const cambiarEstado = async(req,res)=>{
    // Actualiza el estado del tratamiento en la base de datos estableciendo el estado en false
    await Tratamiento.findByIdAndUpdate(req.params.id,{estado:false})
    // Responde con un mensaje de éxito
    res.status(200).json({msg:"Estado del Tratamiento modificado exitosamente"})
}

// Método para agregar un tipo de servicio a un equipo
const tipoServicio = async (req, res) => {
    try {
        const { tipoServicio } = req.body;
        const { id } = req.params;
        // Verificar si el equipo existe
        const equipo = await Equipo.findById(id);
        if (!equipo) {
            return res.status(404).json({ msg: 'Equipo no encontrado' });
        }
        // Si el tipo de servicio es "Reparacion", redirigir al formulario de proforma
        if (tipoServicio === 'Reparacion') {
            return res.redirect('/ruta_al_formulario_de_proforma');
        }
        // Si el tipo de servicio es distinto de "Reparacion", se guarda el tipo de servicio en el equipo
        equipo.tipoServicio = tipoServicio;
        // Si el estado es false, se agrega la fecha de salida
        if (!equipo.estado) {
            equipo.salida = new Date();
        }
        await equipo.save();
        res.json({ msg: 'Tipo de servicio agregado correctamente', equipo });
    } catch (error) {
        console.error('Error al agregar tipo de servicio:', error);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};


// Exporta los métodos de la API relacionados con la gestión de tratamientos
export {
    detalleEquipo,
    registrarEquipo,
    actualizarEquipo,
    eliminarEquipo,
    cambiarEstado,
    tipoServicio
}
