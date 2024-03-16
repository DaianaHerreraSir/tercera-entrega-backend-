
export class ProductRepository{
    constructor (productDao) {
        this.dao = productDao
    }

    getProducts = async () => await this.dao.getProducts()

    getProduct = async (filter) => await this.dao.getProduct(filter)

    createProduct = async (productNew) => await this.dao.createProduct(productNew)

    updateProduct = async (pid, updatedData) => await this.dao.updateProduct(pid, updatedData)

    deleteProduct = async (pid) => await this.dao.deleteProduct(pid)


    
}