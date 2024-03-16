import mongoose from "mongoose"
import dotenv from "dotenv"


dotenv.config()

export const configObject = {
    port: process.env.PORT || 8083,
    jwt_private_key: process.env.JWT_PRIVATE_KEY,
    mongo_url: process.env.MONGO_URL,
    gmail_user:process.env.GMAIL_USER_APP,
    gmail_pass: process.env.GMAIL_PASSWORD_APP,
    twilio_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_token: process.env.TWILIO_AUTH_TOKEN,
    twilio_number: process.env.TWILIO_NUMBER,
    persistence: process.env.PERSISTENCE
}

export const connectDB= async () => {

    try {        
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Base de datos conectada')           
    } catch (error) {
        console.log(error)
    }
}

