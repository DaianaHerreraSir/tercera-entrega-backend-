import ProductsManagerMongo from "../daos/Mongo/ProductsDaoMongo.js";
import UserDaoMongo from "../daos/Mongo/UserDaoMongo.js";

export class ViewControllers {
        constructor(){
            this.productService = new ProductsManagerMongo()
       
        }

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

viewLogin = (req, res) =>{
    res.render("login")
}

viewRegister = (req, res) =>{
    res.render("register")
}



viewPurchase = (req, res) =>{
    res.render("purchase")
}
}