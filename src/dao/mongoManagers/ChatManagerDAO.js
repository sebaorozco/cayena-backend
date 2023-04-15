import { MessagesModel } from '../models/message.model.js';

class ChatManagerDAO {
    //CREO MENSAJES
    static async createChat(req, res) {
        const { body } = req;
        const mensaje = await MessagesModel.create(body);
        emit(mensaje);
        res.status(201).json(mensaje);
    }
    //BUSCO TODOS LOS MENSAJES
    static async getMessages(req, res) {
        const result = await MessagesModel.find();
        res.status(200).json(result)
    }
    //BUSCO MENSAJES POR ID
    static async getMessageById(req, res) {
        const { params: { id } } = req
        const result = await MessagesModel.findById(id)
        if (!result) {
            return res.status(404).end()
        }
        res.status(200).json(result)
    }
    //MODIFICO MENSAJES POR ID
    static async updateMessageById(req, res) {
        const { params: { id }, body } = req
        await MessagesModel.updateOne({ _id: id }, { $set: body })
        res.status(204).end()
        }
    //ELIMINO MENSAJES POR ID
    static async deleteMessageById(req, res) {
        const { params: { id } } = req
        await MessagesModel.deleteOne({ _id: id })
        res.status(204).end()
        }
}

export default ChatManagerDAO;