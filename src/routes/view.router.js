import { Router } from "express";
import { ViewControllers } from "../controllers/view.controllers.js";

const viewRouter = Router();


const{  getViewProduct,
        viewLogin,
        viewRegister,
        viewPurchase} = new ViewControllers()



viewRouter.get("/products",getViewProduct);

viewRouter.get("/login",viewLogin )

viewRouter.get("/register", viewRegister)

viewRouter.get("/carts/:cid/purchase", viewPurchase)





export default viewRouter;



