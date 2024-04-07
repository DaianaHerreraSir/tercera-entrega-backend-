import { Router } from "express";
import { ViewControllers } from "../controllers/view.controllers.js";
import { CartControllers } from "../controllers/carts.controllers.js";
import authorization from "../middleware/authentication.middleware.js";
import { passportCall } from "../middleware/passportCall.js";

const viewRouter = Router();


const{  getViewProduct,
        viewLogin,
        viewRegister,
    } = new ViewControllers()




viewRouter.get("/products",passportCall ("jwt"),authorization(['USER']),getViewProduct,);

viewRouter.get("/login",viewLogin )

viewRouter.get("/register", viewRegister)





export default viewRouter;



