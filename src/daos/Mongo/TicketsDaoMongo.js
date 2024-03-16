import ticketsModel from "./models/ticket.model.js";

class TicketDaoMongo {
    async createTicket(ticketData) {
        try {
            const createdTicket = await ticketsModel.create(ticketData);
            return createdTicket;
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            throw error;
        }
    }
}

export default TicketDaoMongo;
