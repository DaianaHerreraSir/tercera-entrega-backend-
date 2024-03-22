import jwt from 'jsonwebtoken';
import { configObject } from '../config/connectDB.js';

const { jwt_private_key } = configObject;

export const generateToken = (userData) => {
    console.log(userData);
    const { _id, username, role } = userData; 
    const user = {
        _id: _id,
        username: username,
        role: role
    };
    return jwt.sign(user, jwt_private_key, { expiresIn: "24h" });
}; 

        export const authToken = (req, res, next) => {
            const authHeader = req.headers["authorization"];
            if (!authHeader) {
                return res.status(401).send({
                    status: "Error",
                    message: "No se proporcionó el token de autorización"
                });
            }
        
            const token = authHeader.split(' ')[1];
            jwt.verify(token, jwt_private_key, (error, decodeUser) => {
                if (error) {
                    if (error.name === 'TokenExpiredError') {
                        return res.status(401).send({
                            status: "Error",
                            message: "Token de autorización expirado"
                        });
                    } else {
                        return res.status(401).send({
                            status: "Error",
                            message: "Token de autorización inválido"
                        });
                    }
                }
                req.user = decodeUser;
                next();
            });
        };
        