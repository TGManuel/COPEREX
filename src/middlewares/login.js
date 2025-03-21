import { body } from "express-validator";
import { validateFields } from "./validar-campos.js";

export const loginValidator=[
    body("name").notEmpty().withMessage('el nombre es requerido'),
    body("password","La contraseña debe tener minimo 6 digitos").isLength({min:6}),
    validateFields
]