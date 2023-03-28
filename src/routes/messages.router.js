import { Router } from "express";
import ChatManagerDB from "../dao/mongoManagers/ChatManagerDB.js";

const routerMessage = Router();

//CREATE
routerMessage.post('/chat', ChatManagerDB.create);

routerMessage.get('/', async (req, res) => {
    const mensajes = await routerMessage.find()
    res.render('message', { mensajes })
  })
  

export default routerMessage;
