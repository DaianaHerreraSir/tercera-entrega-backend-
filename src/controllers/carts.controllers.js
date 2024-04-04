import cartModel from "../daos/Mongo/models/carts.models.js";
import { CartDao, ProductDao, TicketsDao, UserDao,} from "../daos/factory.js";
import { Types } from 'mongoose';
export class CartControllers {
        constructor (){
            this.cartService =new  CartDao()
            this.ticketService = new TicketsDao ()
            this.productService = new ProductDao()
            this.userService = new UserDao()}
//CREO UN CARRITO
createCart = async (req, res) => {
  try {
    const userId = req.user._id; 
    const newCart = await this.cartService.createCart();
    console.log('Nuevo carrito:', newCart);

    if (!newCart) {
      console.error('Error al crear el carrito. newCart es null o undefined.');
      res.status(500).send('Error al crear el carrito');
      return;
    }

    const cartId = newCart._id;
    // Actualizar el campo cartID del usuario con el ID del carrito creado
    const updatedUser = await this.userService.findByIdAndUpdate(userId, { cartID: cartId }, { new: true });

    // Verificar si se pudo actualizar el usuario
    if (!updatedUser) {
      console.error('Error al actualizar el campo cartID del usuario.');
      res.status(500).send('Error al actualizar el campo cartID del usuario.');
      return;
    }

    // Obtener el carrito actualizado
    const updatedCart = await this.cartService.getCart(cartId);

    res.json(updatedCart);
  } catch (error) {
    console.error("ERROR AL CREAR CARRITO", error);
    res.status(500).send("Error al crear carrito");
  }
}

//OBTENGO EL CARRITO POR SU ID


getCart =async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await this.cartService.getCart(cid);
    console.log("obtencion del carrito",cart); 
    res.render("carts", { cart });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).send("Error al obtener carrito");
  }
}
//OBTENER EL PRODUCTO DEL CARRITO 

getCartProducts = async (req, res) => {
  const { cartId } = req.params;

  try {
    const products = await this.cartService.getCartProducts(cartId);
    if (!products) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(products);
  } catch (error) {
    console.error('Error al obtener los productos del carrito:', error);
    res.status(500).json({ error: 'Error al obtener los productos del carrito' });
  }
}

//AGREGO UN PRODUCTO POR EL ID DEL PRODUCTO
addProductToCart = async (req, res) => {
  try {
    const { pid } = req.params;
    const { userId } = req.user;
    console.log("ID DEL PRODUCTO", pid);

    // Obtener el ID del carrito asociado al usuario
    const user = await this.userService.getUserBy(userId);
    let cartId = user.cartID;

    // Si el usuario no tiene un carrito asociado, crear uno nuevo
    if (!cartId) {
      const newCart = await this.cartService.createCart();
      cartId = newCart._id;

      // Actualizar el ID del carrito en el usuario
      await this.userService.updateUserCartId(userId, cartId);
    }

    // Obtener el producto
    const product = await this.productService.getProduct(pid);
    
    // Verificar si el producto existe
    if (!product) {
      return res.status(404).json({ error: 'El producto no existe' });
    }
// Obtener el carrito y verificar si existe
const cart = await this.cartService.getCart(cartId);
if (!cart) {
  throw new Error('No se pudo encontrar el carrito');
}

// Verificar si el producto ya está en el carrito
const existingProductIndex = cart.products.findIndex(item => item._id.toString() === pid);
if (existingProductIndex !== -1) {
  // Si el producto ya está en el carrito, aumentar la cantidad
  cart.products[existingProductIndex].quantity += 1;
} else {
  // Si el producto no está en el carrito, agregarlo
  cart.products.push({ _id: pid, quantity: 1 });
}

// Guardar los cambios en el carrito
await cart.save();

    // Redirigir al usuario al carrito
    res.redirect(`/api/carts/${cartId}`);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Error al agregar el producto al carrito');
  }
}


//ELIMINO EL CARRITO POR SU ID
deleteCart =async (req, res) => {
    
    const { cid } = req.params;
    
    try {
        
      const deletedCart = await this.cartService.deleteCart(cid);
    
      res.json({ message: 'Carrito eliminado exitosamente', deletedCart });
      } 
    catch (error) {
        console.error('Error al eliminar el carrito:', error);
        res.status(500).send('Error al eliminar el carrito');
      }
    }

//ACTUALIZO CARRITO CON UN ARREGLO DE PRODUCTOS
updateCartProducts = async (req, res) => {
  const { cid } = req.params;
  const products = req.body;

  try {
   
      if (!products || !Array.isArray(products) || products.length === 0) {
          throw new Error('No se proporcionaron productos válidos en la solicitud.');
      }

      //
      const updatedCart = await this.cartService.updateCartProducts(cid, products);

      //
      res.json(updatedCart);
  } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      // Enviar una respuesta de error con un mensaje descriptivo
      res.status(500).send(`Error al actualizar el carrito: ${error.message}`);
  }
}

//ELIMINO UN PRODUCTO DEL CARRITO POR EL ID
removeProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      const deletedCart = await this.cartService.removeProductFromCart(cid, pid, res);
      res.json({ message: 'Producto eliminado exitosamente del carrito', deletedCart });
  
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      res.status(500).send(`Error al eliminar producto del carrito: ${error.message}`);
    }
  }

//ELIMINO TODOS LOS PRODUCTOS DEL CARRITO
clearCart = async (req, res) => {
    const { cid } = req.params;
  
    try {
      await this.cartService.clearCart(cid, res);
    } catch (error) {
      console.error('Error al eliminar todos los productos del carrito:', error);
      res.status(500).send('Error al eliminar todos los productos del carrito');
    }
  }

  // METODO PARA PROCESAR LAS COMPRAS
postPurchase =async (req, res)=> {
  const { cid } = req.params;
  
  try {
      // Obtener el carrito del usuario
      const cart = await this.cartService.getCart(cid);
      
      // Verificar si el carrito está vacío
      if (!cart || !cart.products || cart.products.length === 0) {
          return res.status(400).json({ error: 'El carrito está vacío' });
      }
      
      // Calcular el total de la compra
      let total = 0;
      cart.products.forEach(item => {
          total += item.quantity * item.product.price;
      });


      // Crear un ticket para la compra
      const ticketData = {
          code: generateUniqueCode(),
          purchase_datetime: new Date(),
          amount: total,
          purchaser: req.user.email 
      };

      const ticket = await this.ticketService.createTicket(ticketData);


      // Devolver el ticket creado
      return res.status(200).json(ticket);
  } catch (error) {
      console.error('Error al procesar la compra:', error);
      return res.status(500).json({ error: 'Error al procesar la compra' });
  }
}




}
// Generar un código único para el ticket
function generateUniqueCode() {

  const randomValue = Math.floor(Math.random() * 1000)
  return randomValue
}


