import express from "express"
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js"
import CartManager from "./daos/File/cartManager.js"
import __dirname, { uploader } from "./utils.js";
import { Server as ServerIO } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { configObject } from "./config/connectDB.js";
import  logger from "morgan"

import MessageManagerMongo from "./daos/Mongo/MessageDaoMongo.js";
import messagesRouter from "./routes/message.router.js";
import productModel from "./daos/Mongo/models/products.models.js";
import viewRouter from "./routes/view.router.js";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cookiesRouter from "./routes/cookies.router.js";
import sessionRouter from "./routes/sessions.router.js";

//passport
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import ProductsManagerMongo from "./daos/Mongo/ProductsDaoMongo.js";
import emailRouter from "./routes/email.router.js";
import router from "./routes/userFaker.router.js";
import userFakeRouter from "./routes/userFaker.router.js";



const productManager = new ProductsManagerMongo() 
const messageManager = new MessageManagerMongo();
const cartManager = new CartManager()



const app= express();
const PORT= configObject.port



app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(logger("dev"))
app.use(cookieParser("palabraparafirmarcookies"))

// //SESSION WITH PASSPORT 
initializePassport()
app.use(passport.initialize())



//handlebars

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


//chat
app.get("/chat", async(req,res)=>{
        res.render("chat")
})

//multer imagenes
app.post("/file",uploader.single("myFile"),(req,res) =>{
    res.send("imagen subida")
})



//rutas
app.use("/", viewRouter)
app.use("/api/products",productsRouter);
app.use("/api/carts", cartsRouter )
app.use("/carts",cartsRouter)
app.use("/chat/message", messagesRouter)
app.use("/cookie", cookiesRouter)
app.use("/api/session", sessionRouter)
app.use("/api/email", emailRouter)
app.use("/api", userFakeRouter)

//productos actualizado en tiempo real

app.get('/realTimeProducts', async (req, res) => {
        try {
        const allProducts = await productManager.getProducts();
        res.render('realTimeProducts', { products: allProducts });
        } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        res.status(500).send('Error interno del servidor');
        }
});


//puerto
const httpServer = app.listen(PORT,()=>{
        console.log( "Escuchando en el puerto:" + PORT);
})

const socketServer = new ServerIO(httpServer);

// Websockets
socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado");

try {
        const allMessages = await messageManager.getAllMessages();
        socket.emit("messageLogs", allMessages);
    } catch (error) {
        console.error(error);
    }

    socket.on("message", async (data) => {
        try {
        
            const newMessage = await messageManager.addMessage(data.user, data.message);
            const allMessages = await messageManager.getAllMessages();
            socketServer.emit("messageLogs", allMessages);
        } catch (error) {
            console.error(error);
        }
    });



socket.on('newProduct', async (product) => {
        try {
            console.log('Evento newProduct recibido en el servidor:', product);
            const newProduct = { ...product, id: uuidv4() };
            console.log('Nuevo producto con ID único:', newProduct);
    
            await productManager.createProduct(newProduct);
            console.log('Producto agregado exitosamente.', newProduct);
    
            const updatedProducts = await productManager.getProducts();
    
            socketServer.emit('updateProducts', { products: updatedProducts });
            console.log('Todos los productos:', updatedProducts);
        } catch (error) {
            console.error('Error al agregar un nuevo producto:', error);
            socketServer.emit('updateProducts', { error: 'Error al agregar el producto' });
        }
    });

socket.on("deleteProduct", async (productId) => {
        try {
                await productManager.deleteProduct(productId);

        const updatedProducts = await productManager.getProducts()

socketServer.emit("updateProducts", { products: updatedProducts });
                console.log('Todos los productos:', updatedProducts);

        } catch (error) {
                console.error('Error al eliminar un producto:', error);

socketServer.emit('updateProducts', { error: 'Error al eliminar el producto' });
                }
        })
})



