import { Router } from "express";
import ChatManagerDB from "../../dao/mongoManagers/ChatManagerDB.js";

const routerMessage = Router();

//CREATE
routerMessage.post('/post', ChatManagerDB.createChat);

routerMessage.get('/get', ChatManagerDB.get)
  
routerMessage.get('/get/messages/:mid', ChatManagerDB.getById)

routerMessage.get('/delete/messages/:mid', ChatManagerDB.get)

export default routerMessage;
