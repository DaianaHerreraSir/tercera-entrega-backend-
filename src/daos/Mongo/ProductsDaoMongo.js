import productModel from "./models/products.models.js";

class ProductsDaoMongo {

async getProducts(){
    try {
      const products = await productModel.find();
      return products;
    } catch (error) {
      console.error('Error al obtener todos los productos:', error);
      throw error;
    }
  }

async getProduct() {
    try {

      const products = await productModel.findOne({isActive: true});

      console.log('Productos recuperados:', products);

      return products;

    } catch (error) {
      console.error('Error en getProducts:', error);
      throw error;
    }
  }

async createProduct(productNew) {
    try {
    
      const createdProduct = await productModel.create(productNew);

      const fullProduct = await productModel.findById(createdProduct._id);

      return fullProduct;

    } catch (error) {
      console.error('Error en createProduct:', error);
      throw error;
    }
  }


  async updateProduct(pid, updatedData) {
    try {
      
      return await productModel.findByIdAndUpdate(pid, updatedData, { new: true });

    } 
    catch (error) {
      console.error('Error en updateProduct:', error);
      throw error;
    }
  }

async deleteProduct(pid) {
    try {
      
      return await productModel.findByIdAndDelete(pid);

    } 
    catch (error) {
      console.error('Error en deleteProduct:', error);
      throw error;
    }
  }
  
  async paginate(queryOptions, options) {
    try {
      const { limit = 10, page = 1, sort = {}, lean = true } = options;
      const skip = (page - 1) * limit;

      const query = productModel.find(queryOptions)
        .skip(skip)
        .limit(limit)
        .sort(sort);

      if (lean) {
        query.lean();
      }

      const products = await query.exec();

      const totalDocs = await productModel.countDocuments(queryOptions);
      const totalPages = Math.ceil(totalDocs / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: products,
        totalDocs,
        limit,
        totalPages,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null
      };
    } catch (error) {
      console.error('Error en paginate:', error);
      throw error;
    }
  }  
}

export default ProductsDaoMongo;
