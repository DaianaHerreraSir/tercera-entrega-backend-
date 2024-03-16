import jwt from 'jsonwebtoken';
import { configObject } from '../config/connectDB.js';


const {jwt_private_key} = configObject

export const generateToken = (user) =>  jwt.sign(user, jwt_private_key, 
        {expiresIn: "24h"});


export const authToken = (req, res, next) =>{

    const authHeader = req.headers["authorization"]
    if(!authHeader) return res.status(401).send({

        status: "Error",
        message: "no token"
    })

    const token = authHeader.split(' ')[1]

    jwt.verify(token,jwt_private_key, (error, decodeUser)=>{
        if(error) return res.status(401).send({

            status: "Error",
            message: "no authorizated"
        })
        req.user = decodeUser
        next()
    })
}
