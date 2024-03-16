import nodemailer from "nodemailer";
import { configObject } from "../config/connectDB.js";


const transport =  nodemailer.createTransport({
    service: "gmail",
    port:587,
    auth:{
        user: configObject.gmail_user,
        pass: configObject.gmail_pass
    }

})



export const sendMail = async (to, subject, html) => await transport.sendMail({
    from: "Coder test ",
    to,
    subject,
    html

})

