import { verify } from "argon2"

import User from "./user.model.js"
import { generateJWT } from "../helpers/generate-JWT.js"

export const login = async (req,res) => {

    const { name, password } =req.body
    
    try {
        const user = await User.findOne({name})
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                ss: false
            })
        }

        if (!user.estado) {
            return res.status(403).json({
                message: "The user does not exist",
                ss: false
            })
        }


        const validPass = await verify(user.password, password)
        if (!validPass) {
            return res.status(403).json({
                msg: 'Incorrect password'
            })
        }

        const token = await generateJWT(user._id) 

        res.status(200).json({
            msg: 'User authenticated successfully',
            details:{
                name: user.name,
                token: token
            }
        })


    } catch (error) {
       console.log(flag)
        res.status(500).json({
            ss: false,
            error: error.message
        })
    }
}
