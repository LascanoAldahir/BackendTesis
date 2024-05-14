// Importar la función de validación y el objeto de resultado de validación de express-validator
import { check, validationResult } from 'express-validator';

// Array de middleware de validación para la entidad de veterinario
export const validacionTecnico = [
    // Validar que los campos nombre, apellido, dirección, teléfono, email y password existan en la solicitud
    check(["nombre", "apellido", "ruc", "telefono", "email", "password"])
        .exists()
        .withMessage('Los campos "nombre", "apellido", "ruc", "teléfono", "email" y/o "password" son obligatorios')
        // Validar que los campos no estén vacíos
        .notEmpty()
        .withMessage('Los campos "nombre", "apellido", "ruc", "teléfono", "email" y/o "password" no pueden estar vacíos')
        // Eliminar los espacios en blanco del valor de los campos
        .customSanitizer(value => value?.trim()),

    // Validar los campos nombre y apellido para asegurar que tengan entre 3 y 12 caracteres y solo letras
    check(["nombre", "apellido"])
        .isLength({ min: 3, max: 12 })
        .withMessage('El campo "nombre" y/o "apellido" debe(n) tener entre 3 y 12 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' })
        .withMessage('El campo "nombre" y/o "apellido" debe(n) contener solo letras')
        // Eliminar los espacios en blanco del valor de los campos
        .customSanitizer(value => value?.trim()),

    // Validar el campo dirección para asegurar que tenga entre 3 y 20 caracteres
    check("ruc")
        .isLength({ min: 3, max: 20 })
        .withMessage('El campo "ruc" debe tener entre 3 y 20 caracteres')
        // Eliminar los espacios en blanco del valor del campo
        .customSanitizer(value => value?.trim()),

    // Validar el campo teléfono para asegurar que tenga al menos 10 dígitos y contenga solo números
    check("telefono")
        .isLength({ min: 10 })
        .withMessage('El campo "teléfono" debe tener al menos 10 dígitos')
        .isNumeric()
        .withMessage('El campo "teléfono" debe contener solo números')
        // Eliminar los espacios en blanco del valor del campo
        .customSanitizer(value => value?.trim()),

    // Validar el campo email para asegurar que tenga un formato de correo electrónico válido
    check("email")
        .isEmail()
          .withMessage('El campo "email" no es correcto')
        // Eliminar los espacios en blanco del valor del campo
        .customSanitizer(value => value?.trim()),

    // Validar el campo password para asegurar que tenga al menos 5 caracteres, contenga al menos una letra mayúscula, una letra minúscula, un número y un carácter especial
    check("password")
        .isLength({ min: 5 })
        .withMessage('El campo "password" debe tener al menos 5 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*).*$/)
        .withMessage('El campo "password" debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial')
        // Eliminar los espacios en blanco del valor del campo
        .customSanitizer(value => value?.trim()),

    // Middleware para manejar los errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
];
