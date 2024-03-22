import { Router } from "express";
import  authorization  from "../middleware/authentication.middleware.js";
import passport from "passport";
import  passportCall  from "../middleware/passportCall.js";
import { SessionsControllers } from "../controllers/sessions.controllers.js";


const sessionRouter = Router()

const {register,
        login,
        current,
        github,
        githubcallback} = new SessionsControllers()

//REGISTRO
sessionRouter.post("/register", register )
//LOGIN
sessionRouter.post("/login", login )
//CURRENT
sessionRouter.get("/current", passportCall("jwt"), authorization(["USER"]) , current)
//GITHUB
sessionRouter.get("/github",passport.authenticate("github", { session: false, failureRedirect: "/login" }), github);
//GITHUBCALLBACK
sessionRouter.get("/githubcallback", passport.authenticate("github", { session: false, failureRedirect: "/login" }), githubcallback);




export default sessionRouter