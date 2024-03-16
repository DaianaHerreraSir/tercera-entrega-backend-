import MessageManagerMongo from "../daos/Mongo/MessageDaoMongo.js";

export class MessageController{
        constructor (){
            this.messageService =new MessageManagerMongo()
        }


addMessage =async (req, res) => {
    const { user, message } = req.body;

    try {
        const newMessage = await this.messageService.addMessage(user, message);
        res.json(newMessage);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar el mensaje" });
    }
}

getAllMessages = async (req, res) => {
    
    try {
        const messages = await this.messageService.getAllMessages();
        res.json(messages);
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los mensajes" });
    }
}
}