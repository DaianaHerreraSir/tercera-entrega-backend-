import { Router } from "express";
import { ProductControllers } from "../controllers/products.controllers.js";


const productsRouter = Router();

const{getProduct,
      getProducts,
      createProduct,
      updateProduct,
      deletProduct
      } = new ProductControllers ()

productsRouter.get("/", getProducts )

productsRouter.get("/:pid",getProduct);


productsRouter.post("/",createProduct);


productsRouter.put("/:pid", updateProduct);

productsRouter.delete("/:pid", deletProduct);

export default productsRouter;

