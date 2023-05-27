import { ChatManagerDAO } from "../dao/factory.js";
import Exception from "../utils/exception.js";

export const getMessages = async (req, res, next) => {
    try {
        const messages = await ChatManagerDAO.getMessages();
        res.status(201).json({ status: 'success', messages })
    } catch (error) {
        next(error);
    }
}

export const getMessageById = async (req, res, next) => {
    try {
        const { params: { mid } } = req;
        const expectedMessage = await ChatManagerDAO.getMessageById(mid);
        if (!expectedMessage) {
            throw new Exception('Message not found', 404);
        }
        res.json({ expectedMessage });
    } catch (error) {
        next(error);
    }
}

export const createMessage = async (req, res) => {
    try {
        const { body } = req
        const newMessage = await ChatManagerDAO.createMessage(body)
        res.status(201).json({success: true, payload: newMessage});
    } catch (error) {
        res.json({ error: error.message });
    }
}

export const updateMessageById = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const { name, mail, message } = req.body;
        const updateMessageInfo = {
            name,
            mail,
            message,
        } 
        const expectedMessage = await ChatManagerDAO.getMessageById({ _id: mid });
        if(!expectedMessage){
            throw new Exception('Message not found', 404);
        }
        await ChatManagerDAO.updateMessageById({ _id: mid }, updateMessageInfo);
        const data = await ChatManagerDAO.getMessageById(mid);
        res.json({ message: data });
    } catch (error) {
        next(error)
    }
}

export const deleteMessageById = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const expectedMessage = await ChatManagerDAO.getMessageById(mid);
        if(!expectedMessage){
            throw new Exception('Message not found', 404);
        }
        await ChatManagerDAO.deleteMessageById(mid)
        res.json({ success: true, message: "Message deleted."})
    } catch (error) {
        next(error);
    }   
}