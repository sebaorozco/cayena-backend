import { TicketsModel } from "../models/ticket.model.js"

class TicketManagerDAO {
    //CREO EL CARRITO
    static async createTicket(code, amount, purchaser) {
        try {
            return await TicketsModel.create(code, amount, purchaser);
        } catch (error) {
            return null;
        }
    }
}

export default TicketManagerDAO;