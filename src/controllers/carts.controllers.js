
import { CartDao, ProductDao, TicketsDao, UserDao,} from "../daos/factory.js";

export class CartControllers {
        constructor (){
            this.cartService =new  CartDao()
            this.ticketService = new TicketsDao ()
            this.productService = new ProductDao()
            this.userService = new UserDao()
        }
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
      console.log(cart); // Agrega este console.log para verificar la estructura de cart
      res.render("products", { cart });
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).send("Error al obtener carrito");
    }
  }
//AGREGO UN PRODUCTO POR EL ID DEL PRODUCTO
addProductToCart = async (req, res) => {
  const { pid } = req.params; // 
  const { title, description, price, quantity } = req.body; 
  const userId = req.user.id; 
  try {
   
    let user = await this.userService.getUserById(userId);
    let cartId = null;

    if (!user || !user.cartID) {
      
      const newCart = await this.cartService.createCart();
      cartId = newCart._id;

     
      user = await this.userService.updateUserCartId(userId, cartId);
    } else {
      
      cartId = user.cartID;
    }

    // Agrega el producto al carrito
    const updatedCart = await this.cartService.addProductToCart(cartId, pid, title, description, price, quantity);

    // Responder con un mensaje de éxito
    res.send("Producto agregado al carrito correctamente.");
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).send(`Error al agregar producto al carrito: ${error.message}`);
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

//ACTUALIZO CARRITO CON UN ARREGLO DE PRODUCTOS
updateCartProducts = async (req, res) => {
    const { cid } = req.params;
    const products = req.body;
  
    try {
      await this.cartService.updateCartProducts(cid, products, res);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      res.status(500).send(`Error al actualizar el carrito: ${error.message}`);
    }
  }
//ACTUALIZO CANTIDAD DE PRODUCTO EN UN EL CARRITO
updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
  
    try {
      await this.cartService.updateProductQuantity(cid, pid, quantity, res);
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto en el carrito:", error);
      res.status(500).send(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
    }
  }

//CARRITO CON PRODUCTOS COMPLETOS 
getPopulatedCart =async (req, res) => {
    const { cid } = req.params;
  
    try {
      const cart = await this.cartService.getPopulatedCart(cid);
      res.json(cart);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).send("Error al obtener carrito");
    }
  }

  // Método para procesar la compra
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




  
