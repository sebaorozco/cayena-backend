import { Router } from "express";
import { MessagesModel } from "../dao/models/message.model.js";
import ChatManagerDAO from "../dao/mongoManagers/ChatManagerDAO.js";

const router = Router();

// CREATE

router.post('/', ChatManagerDAO.createChat);

// READ
router.get('/', async (req, res) => {
    try {
        const mensajes = await MessagesModel.find();
        res.status(201).render('chat', mensajes);   
    } catch (error) {
        res.json({ error: error.message });
    }
})




export default router;