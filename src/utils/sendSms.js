
import pkg from 'twilio';
const { Twilio } = pkg;

import { configObject } from "../config/connectDB.js";

const {twilio_sid,twilio_token,twilio_number} = configObject

const client = new Twilio(twilio_sid, twilio_token)

export const sendSms = (nombre, apellido) => client.messages.create({
    body: `Gracias por tu compra ${nombre} ${apellido}`,
    from: twilio_number,
    to: ""
})