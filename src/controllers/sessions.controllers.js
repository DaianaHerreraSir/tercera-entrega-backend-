
import { CartDao, UserDao } from "../daos/factory.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { generateToken } from "../utils/jsonwebtoken.js";

export class SessionsControllers {
    
        constructor (){
            this.userService = new UserDao()
            this.cartService= new CartDao()
        }


//REGISTRO

register = async(req, res)=>{
    try {
           const{first_name, last_name, email, password}= req.body

const userNew= {
    first_name, 
    last_name,
    email,
    password: createHash(password)
}
const result = await this.userService.createUser(userNew)


const token = generateToken({
    first_name,
    last_name,
    id: result._id
})

res.cookie("cookieToken", token,{
    maxAge: 60 * 60 * 1000 *24,
    httpOnly: true
}).send({
    status: "success",
    usersCreate: result, 
    token
})
    } catch (error) {
        res.send({status: "error", error })
    }

}

//LOGIN
login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar las credenciales del usuario
        const user = await this.userService.getUserBy({ email });
        if (!isValidPassword(password, user.password)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        // TOKEN
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        const token = generateToken(tokenPayload);

        // Verificar si el usuario tiene un carrito asociado
        if (!user.cartID) {
            // Si el usuario no tiene un carrito asociado, crea un nuevo carrito
            const newCart = await this.cartService.createCart();
            // Actualiza el ID del carrito en el documento del usuario
            await this.userService.updateUser(user._id, { cartID: newCart._id });
        }

        // Establecer la cookie del token
        res.cookie("cookieToken", token, {
            maxAge: 60 * 60 * 1000 * 24,
            httpOnly: true
        });

        // Redireccionar al usuario a la página deseada después del inicio de sesión exitoso
        res.redirect("/products");
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).send({ status: "error", error });
    }
}

// login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await this.userService.getUserBy({ email });
//         if (!isValidPassword(password, user.password)) return res.status(401).send("contraseña incorrecta");

//         //TOKEN
//         const token = generateToken({
//             id: user._id,
//             email: user.email,
//             role: user.role
//         });

//         res.cookie("cookieToken", token, {
//             maxAge: 60 * 60 * 1000 * 24,
//             httpOnly: true
//         });
//         res.redirect("/products");
//     } catch (error) {
//         console.log(error);
//         res.send({ status: "error", error });
//     }
// }


// login =async(req,res)=>{

// try {
//         const {email, password}= req.body

//     const user= await this.userService.getUserBy({email})
//     if(!isValidPassword(password, user.password)) return res.status(401).send("contraseña incorrecta")

// //TOKEN
// const token = generateToken({
//     id: user._id,
//     email: user.email,
//     role: user.role
//     })

//     res.cookie("cookieToken", token, {
//         maxAge : 60 * 60 * 1000 *24,
//         httpOnly: true
//     }).send({
//         status: "success",
//         usersCreate: "login success", 
//         token
//     })
//     res.redirect("/products");
// } catch (error) {
//     console.log(error);
// res.send({status: "error", error})  
// }

// }
//CURRENT

current =async(req,res)=>{
try {
    const userDto = new userDto(req.user); 
    res.send({ user: userDto, message: "Información del usuario" });
} catch (error) {
    res.send({ status: "error", error });
}
};



//GITHUB

github = async (req, res) => {
    try {
        res.send("aprobado")

    } catch (error) {
        res.send({status: "Error",error})
    } 
    }
    
//GITHUBCALLBACK
githubcallback = async(req, res) => {
    try {
        // Verificar si req.user está definido
        if (!req.user) {
            // Si req.user no está definido, enviar un mensaje de error
            return res.status(401).json({ status: "error", error: "User not authenticated" });
        }

        
        const token = generateToken(req.user);

        
        res.cookie('cookieToken', token, { httpOnly: true });

        
        res.redirect("/products");
    } catch (error) {
        console.error("Error en githubcallback:", error);
        res.status(500).json({ status: "error", error });
    }
}

}