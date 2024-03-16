import cookieParser from "cookie-parser";
import { Router } from "express";

const cookiesRouter = Router ()



//cookies
cookiesRouter.get("/setCookie", (req, res) => {
    res.cookie("CoderCookie", "esta es una cookie", {maxAge: 10000}).send ("enviando cookie")
})

cookiesRouter.get("/getCookie" , (req, res) =>{
    console.log(req.cookies)

    res.send(req.cookies)
})

//cookie firmada
cookiesRouter.get("/setCookieSigned", (req, res) => {

    res.cookie("CoderCookie", "esta es una coockie firmada", {maxAge: 10000, signed : true}).send ("enviando cookie firmada")
})


cookiesRouter.get("/getCookieSigned", ( req, res) => {

    console.log(req.signedCookies);

    res.send( req.signedCookies)
})

//ekiminar cookies
cookiesRouter.get ("/deleteCookie", (req, res) => {
    
    res.clearCookie("CoderCookie").send ("cookie borrada")
})


export default cookiesRouter