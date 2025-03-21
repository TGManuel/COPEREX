import { Router } from "express";
import { check } from "express-validator";
import { validateFields } from "../middlewares/validar-campos.js";
import { saveBusiness, getBusiness, updateBusiness, generateReport } from "./business.controller.js";
import { validateJWT } from "../middlewares/validar-JWT.js";

const router = Router();

router.get('/', validateJWT ,getBusiness);

router.post(
    '/save',
    [
        validateJWT,
        check('name', 'Business name is required').not().isEmpty(),
        check('description', 'Business description is required').not().isEmpty(),
        check('impact', 'Business impact is required').not().isEmpty(),
        check('years', 'Business years are required').not().isEmpty(),
        check('category', 'Business category is required').not().isEmpty(),
        validateFields
    ], 
    saveBusiness
);

router.put(
    '/update/:id',
    [
        validateJWT,
        validateFields
    ],
    updateBusiness
);

router.post('/reports',validateJWT, generateReport);

export default router