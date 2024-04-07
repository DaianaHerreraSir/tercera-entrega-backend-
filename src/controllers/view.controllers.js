
import ProductsManagerMongo from "../daos/Mongo/ProductsDaoMongo.js";
import { CartDao, TicketsDao } from "../daos/factory.js";
import exphbs from "express-handlebars";
import express from "express";



export class ViewControllers {
    constructor() {
        this.productService = new ProductsManagerMongo();
        this.cartService = new CartDao();
        this.ticketService = new TicketsDao()
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
    
            const {cartID, email}= req.user
         
            res.render("products", {
                status: "success",
                payload: {
                    cartID,
                    email,
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
}    
