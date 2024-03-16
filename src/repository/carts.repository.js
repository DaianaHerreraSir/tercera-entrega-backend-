
export class CartRepository{
        constructor(cartDao){
            this.cartService = cartDao
        }
    
    createCart = async()=> await this.cartService.createCart()

    getCart = async (cid) => await this.cartService.getcart(cid)

    getCartProducts = async(cid) => await this.getCartProducts(cid)

    newCart = async() => await this.cartService.newCart()

    addProdcutToCart = async(cid, pid,  title, description, price, quantity = 1, res) =>await this.cartService.addProdcutToCart(cid, pid, title, description, price, quantity = 1, res)

    updateCartProducts = async(cid, products, res) => await this.cartService.updateCartProducts(cid, products, res)

    deleteCart= async(cid) => await this.cartService.deleteCart(cid)
}