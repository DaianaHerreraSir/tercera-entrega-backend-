
import ProductsManagerMongo from "../daos/Mongo/ProductsDaoMongo.js";
import { CartDao } from "../daos/factory.js";
import exphbs from "express-handlebars";
import express from "express";



export class ViewControllers {
    constructor() {
        this.productService = new ProductsManagerMongo();
        this.cartService = new CartDao();
    }

    // VISTA DE PRODUCTO
    getViewProduct =  async (req, res) => {
        const { limit = 4, pageQuery = 1, query } = req.query;
    
        try {
            let queryOptions = {};
    
            if (query) {
               
                queryOptions = {
                    ...queryOptions,
                    //
                    title: { $regex: new RegExp(query, 'i') }
                };
            }
    
            const {
                docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page
            } = await this.productService.paginate(queryOptions, { limit, page: pageQuery, sort: { price: -1 }, lean: true });
    
            const user = req.user
            res.render("products", {
                status: "success",
                payload: {
                    user: user,
                    products: docs,
                    hasPrevPage,
                    hasNextPage,
                    prevPage,
                    nextPage,
                    page
                }
            });
        } catch (error) {
            console.log(error);
            
            res.render("products", {
                status: "error",
                payload: {
                    message: "Error al obtener la lista de productos."
                }
            });
        }}
    
    
    // VISTA DE INICIO DE SESION
    viewLogin = (req, res) => {
        res.render("login");
    }

    // VISTA DE REGISTRO
    viewRegister = (req, res) => {
        res.render("register");
    }

    // VISTA DE COMPRA
    viewPurchase = (req, res) => {
        res.render("purchase");
    }

// VISTA DE AGREGAR CARRITO
    viewAddToCart = async (req, res) => {
        const { userId } = req.user; //
        console.log( "id del usuario", userId);
    
        try {
            // Obtener el ID del carrito asociado al usuario
            const user = await this.userService.getUserBy(userId);
            const cartId = user.cartID;
            console.log("cart del usuario", cartId);
    
            // Verificar si el usuario tiene un carrito asociado
            if (!cartId) {
                console.error("El usuario no tiene un carrito asociado.");
                
                return res.status(404).send("El usuario no tiene un carrito asociado.");
            }
    
            // datos del carrito asociado al usuario
            const cart = await this.cartService.getCart(cartId);
            

            res.render("carts", { cart: cart });
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            res.status(500).send("Error al obtener el carrito");
        }
    }
}    