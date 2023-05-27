import { MessagesModel } from '../models/message.model.js';

class ChatManagerDAO {
    //CREO MENSAJES
    static async createMessage(body) {
        try {
            return await MessagesModel.create(body);
        } catch (error) {
            return null;
        }
    
    }

    //BUSCO TODOS LOS MENSAJES
    static async getMessages(req, res) {
        try {
            return await MessagesModel.find();
        } catch (error) {
            return null;   
        }
    }

    //BUSCO MENSAJES POR ID
    static async getMessageById(mid) {
        try {
            return await MessagesModel.findById(mid);
        } catch (error) {
            return null;
        }   
    }

    //MODIFICO MENSAJES POR ID
    static async updateMessageById(mid, updateMessageInfo) {
         try {
            return await MessagesModel.updateOne({ _id: mid }, updateMessageInfo);
        } catch (error) {
            return null;
        }
    }

    //ELIMINO MENSAJES POR ID
    static async deleteMessageById(mid) {
        try {
            return await MessagesModel.findByIdAndDelete(mid);
        } catch (error) {
            return null;
        }
    }
}

export default ChatManagerDAO;