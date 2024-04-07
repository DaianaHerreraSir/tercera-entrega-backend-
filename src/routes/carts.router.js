
import { Router } from "express";
import CartManagerMongo from "../daos/Mongo/CartDaoMongo.js";
import { CartControllers } from "../controllers/carts.controllers.js";

import authorization from "../middleware/authentication.middleware.js";
import { passportCall } from "../middleware/passportCall.js";

const cartsRouter = Router();

const{createCart,
      getCart,
      addProductToCart,
      deleteCart,
      removeProductFromCart,
      clearCart,
      updateCartProducts,
      postPurchase,
      getCartProducts,
      
} =  new CartControllers()


//creo un carrito
cartsRouter.post("/", createCart);

//agrego un producto por el id del producto

cartsRouter.post("/:cid/products/:pid", passportCall('jwt'), authorization(['USER']),addProductToCart);

//obtengo el carrito por su id
cartsRouter.get("/:cid", getCart);

//obtengo el producto del carrito 
cartsRouter.get('/carts/:cid/products',getCartProducts)


//elimino el carrito por su id
cartsRouter.delete('/:cid',deleteCart );

// Eliminar un producto del carrito por el id
cartsRouter.delete('/:cid/products/:pid', removeProductFromCart);

// Eliminar todos los productos del carrito
cartsRouter.delete('/api/carts/:cid', clearCart );

// Actualizar carrito con un arreglo de productos
cartsRouter.put('/:cid', updateCartProducts);

// Implementación de la ruta /:cid/purchase
cartsRouter.post('/:cid/purchase', passportCall('jwt'), authorization(['USER']),postPurchase)




export default cartsRouter;





