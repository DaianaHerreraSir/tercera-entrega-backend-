import { Router } from "express";
import { MessageController } from "../controllers/message.controllers.js";


const messagesRouter = Router();


const{addMessage, getAllMessages} = new MessageController()



messagesRouter.post("/messages", addMessage )

messagesRouter.get("/messages", getAllMessages );

export default messagesRouter
