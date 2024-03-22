
import { CartDao, UserDao } from "../daos/factory.js";
import { UserDto } from "../dto/userDto.js";
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
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };
        const token = generateToken(tokenPayload);
        console.log("Token:", token);

        // Verificar si el usuario tiene un carrito asociado
        if (!user.cartID) {
            // Si el usuario no tiene un carrito asociado, crea un nuevo carrito
            const newCart = await this.cartService.createCart();
            // Actualiza el ID del carrito en el documento del usuario
            await this.userService.updateUser(user._id, { cartID: newCart._id });
        }

       
        res.cookie("cookieToken", token, {
            maxAge: 60 * 60 * 1000 * 24, 
            httpOnly: true,
            
        });

    
        res.redirect("/products");
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).send({ status: "error", error });
    }
}


//CURRENT
 current = async (req, res) => {
    try {
        const userDto = new UserDto(req.user); 
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
        if (!req.user) {
        
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