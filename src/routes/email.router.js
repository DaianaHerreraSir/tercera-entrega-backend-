import { Router } from "express";
import { sendMail } from "../utils/sendEmail.js";
import { sendSms } from "../utils/sendSms.js";

const emailRouter = Router ()

emailRouter.get("/email", (req, res)=>{
    
const destinatario = "daiherrerasir@gmail.com"
const subject="Email de prueba coder"
const html = "<div><h1>Este es un mail de prueba</h1></div>"


sendMail(destinatario, subject,html)
res.send( "Email enviado")
})

export default emailRouter

emailRouter.get("/sms", (req, res)=>{
    sendSms("Daiana", "Herrera")
    res.send("Sms enviado")
})


