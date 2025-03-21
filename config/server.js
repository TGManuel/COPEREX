import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import User from "../src/auth/user.model.js"
import { hash } from "argon2"

import authRoutes from "../src/auth/auth.routes.js"
import businessRoutes from "../src/business/business.routes.js"

const createDefaultUser = async () => {
    try {
        const userExists = await User.findOne({ name: 'admin' });
        const hashedPassword = await hash("1234567");

        if (!userExists) {
            const defaultUser = new User({
                name: 'admin',
                password: hashedPassword, 
            });

            await defaultUser.save();
            console.log('Usuario por defecto creado');
        } else {
            console.log('El usuario por defecto ya existe');
        }
    } catch (error) {
        console.error('Error al crear el usuario por defecto:', error);
    }
};

const middlewares = (app)=>{
    app.use(express.urlencoded({extended: false})) 
    app.use(express.json()) 
    app.use(cors()) 
    app.use(helmet()) 
    app.use(morgan('dev')) 
}

const routes = (app)=>{
    app.use("/businessSystem/auth",authRoutes)
    app.use("/businessSystem/business",businessRoutes)
}




const conectarDb = async ()=>{
    try {
        await dbConnection()
        console.log('Conexión exitosa con la DB')
    } catch (error) {
        console.log('Error al conectarse a la DB',error)
    }
}


export const initServer = ()=>{
    const app = express()
    const port= process.env.PORT || 3001

    try {
        middlewares(app)
        conectarDb()
        createDefaultUser()
        routes(app)
        app.listen(port)
        console.log(`Server running on port ${port}`)
    } catch (error) {
        console.log(`Server init failed ${error}`)
    }
}