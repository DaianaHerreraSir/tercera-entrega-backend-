
import productModel from "./models/products.models.js";
import cartModel from "./models/carts.models.js";
import usersModel from "./models/users.model.js";

class CartDaoMongo {

  async createCart() {
    try {
      const newCart = await cartModel.create({ products: [] });
      console.log('Nuevo carrito creado:', newCart);
      return newCart;
    } catch (error) {
      console.error('Error en createCart:', error);
      throw error;
    }
  }
  
  async getCart(cid) {
    try {
        const cart = await cartModel.findById(cid).lean();
        console.log(cart);
      

        return cart; // 
    } catch (error) {
        console.error('Error en getCart:', error);
        throw error;
    }
}

  
  async cartExists(cartId) {
    try {
        // busca el carrito en la base de datos
        const cart = await cartModel.findById(cartId);
        return !!cart;

    } catch (error) {
        console.error("Error al verificar si el carrito existe:", error);
        return false; 
    }
}
async getCartProducts(cid) {
  try {
      const cart = await cartModel.findById(cid).populate('products.product');
     
      if (cart) {
          return cart.products
      } else {
          console.log("Carrito no encontrado");
          return [];
      }
  } catch (error) {
      console.error('Error en getCartProducts:', error);
      throw error;
  }
}

async newCart() {
    try {
      const newCart = { products: [] };
      await cartModel.create(newCart);
      return newCart;
    } catch (error) {
      console.error('Error en newCart:', error);
      throw error;
    }
  }

async addProductToCart(cid, pid, title, description, price, quantity = 1, res) {
  try {
    const cart = await cartModel.findById(cid);
    if (!cart) {
    throw new Error('Carrito no encontrado');
    }

    // Ver si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(entry => entry.product.equals(pid));

    if (existingProductIndex !== -1) {
  // Si el producto ya existe, aumenta su cantidad
    cart.products[existingProductIndex].quantity += quantity;
        } else {
    // Sino  lo agregarla al carrito
    cart.products.push({ product: pid, quantity });
        }

    const updatedCart = await cart.save();

    if (res) {
            res.json(updatedCart);
        }

      return updatedCart;
    } catch (error) {
        console.error('Error en addProductToCart:', error);
        throw error;
    }
}

async updateCartProducts(cid, products, res) {
  try {
    const cart = await this.getPopulatedCart(cid);

  if (!cart) {
    throw new Error('Carrito no encontrado');
      }

  for (const product of products) {
    const { pid, title, description, price, quantity } = product;

    const existingEntry = cart.products.find(entry => entry.product.equals(pid));

    if (existingEntry) {
      existingEntry.quantity += quantity;
    } 
    else {
      const existingProduct = await productModel.findById(pid);
    if (existingProduct) {
      cart.products.push({
      product: existingProduct._id,
      title,
      description,
      price,
      quantity
      });
    } 
    else {
      console.warn(`Producto con ID ${pid} no encontrado`);
          }
  }
}

    await cart.save();
      const updatedCart = await this.getPopulatedCart(cid);

    if (res) {
        res.json(updatedCart);
      }

    return updatedCart;
    } catch (error) {
    console.error('Error en updateCartProducts:', error);
    throw error;
    }
  }

async deleteCart(cid) {
  try {
    const deletedCart = await cartModel.findByIdAndDelete(cid);
    if (!deletedCart) {
    throw new Error('Carrito no encontrado');
  }
    return deletedCart;
  } 
  catch (error) {
    console.error('Error en deleteCart:', error);
    throw error;
    }
}
async removeProductFromCart(cid, productId, res) {
  try {
    const cart = await cartModel.findById(cid);
  
    if (!cart) {
      throw new Error('Carrito no encontrado');
  }
  
const index = cart.products.findIndex(entry => entry.product && entry.product.equals(productId));
  
  if (index !== -1) {
    cart.products.splice(index, 1);
    await cart.save();
    const updatedCart = await cartModel.findById(cid); // Obtener el carrito actualizado después de eliminar el producto
    if (res) {
        res.json(updatedCart);
    }
    return updatedCart;
    } 
  else {
    throw new Error('Producto no encontrado en el carrito');
      }
  } 
  catch (error) {
    console.error('Error en removeProductFromCart:', error);
    throw error;
  }

  }
  
  async removeProductFromCart(cid, productId, res) {
    try {
      const cart = await this.getPopulatedCart(cid);

      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const index = cart.products.findIndex(entry => entry.product && entry.product.equals(productId));

      if (index !== -1) {
        cart.products.splice(index, 1);
        await cart.save();
        const updatedCart = await this.getPopulatedCart(cid);
        if (res) {
          res.json(updatedCart);
        }
        return updatedCart;
      } else {
        throw new Error('Producto no encontrado en el carrito');
      }
    } catch (error) {
      console.error('Error en removeProductFromCart:', error);
      throw error;
    }
  }

  async getPopulatedCart(cartId) {
    try {
        // Utiliza populate() para poblar los detalles de los productos en el carrito
        const cart = await cartModel.findById(cartId).populate('products.product');
        return cart;
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        throw error;
    }
}

}


export default CartDaoMongo;
