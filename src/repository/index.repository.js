import { CartDao, ProductDao, UserDao } from "../daos/factory.js";
import { CartRepository } from "./carts.repository.js";
import { ProductRepository } from "./products.repository.js";
import { UserRepository } from "./user.repository.js";


//dao atraves del factory
const userService =  new UserRepository(new UserDao())

const productService = new ProductRepository (new ProductDao())

const cartService = new CartRepository( new CartDao())

export default {userService, productService,cartService}