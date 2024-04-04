import { Router } from "express";
import { ViewControllers } from "../controllers/view.controllers.js";
import { CartControllers } from "../controllers/carts.controllers.js";
import authorization from "../middleware/authentication.middleware.js";
import { passportCall } from "../middleware/passportCall.js";

const viewRouter = Router();


const{  getViewProduct,
        viewLogin,
        viewRegister,
        viewPurchase,
        viewAddToCart} = new ViewControllers()
       



viewRouter.get("/products",passportCall ("jwt"),authorization(['USER']),getViewProduct,);

viewRouter.get("/login",viewLogin )

viewRouter.get("/register", viewRegister)

viewRouter.get("/carts/:cid/purchase", viewPurchase)

viewRouter.get("api/carts/:cid", viewAddToCart);





export default viewRouter;



