
import { ProductDao } from "../daos/factory.js";


export class ProductControllers{
    constructor(){
        this.productService = new ProductDao()
    }


//TRAER TODOS LOS PRODUCTOS
    getProducts = async (req, res) => {

        try {
        
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || 'none';
        const query = req.query.query || '';
        
        
        const options = {
            page,
            limit,
            sort: sort === 'none' ? {} : { price: sort === 'asc' ? 1 : -1 },
        };
        
        
        const filter = query ? { title: new RegExp(query, 'i') } : {};
        
        
        const result = await this.productService.paginate(filter, options);
        
        res.json({
            total: result.totalDocs,
            limit: result.limit,
            page: result.page,
            sort,
            query,
            products: result.docs,
        });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
        }
        
        
//TRAER UN PRODUCTO
    getProduct =  async (req, res) => {

        const { pid } = req.params;
        
        try {
        const product = await this.productService.getProduct(pid);
        res.send(product);
        } 
        catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor");
        }
    }

//CREAR UN PRODUCTO
    createProduct =  async (req, res) => {

        const { title, description, price, thumbnail, code, stock, status = true, category } = req.body[0];
        
        const productNew = {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
        };

        try {
        const createdProduct = await this.productService.createProduct(productNew);
        res.send({ success: true, message: 'Producto creado exitosamente', product: createdProduct });
        } 
        catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor");
        }
    }

//ACTUALIZAR UN PRODUCTO
    updateProduct =async (req, res) => {

        const { pid } = req.params;
        
        const productToUpdate = req.body;
        
        try {
        const result = await this.productService.updateProduct(pid, productToUpdate);
        res.send(result);
        } 
        catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor");
        }
    }


//ELIMINAR UN PRODUCTO
    deletProduct = async (req, res) => {

        const { pid } = req.params;
        
        try {
        const result = await this.productService.deleteProduct(pid);
        res.send(result);
        } 
        catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor");
        }
    }
}