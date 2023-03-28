import { Router } from "express";
import ChatManagerDB from "../dao/mongoManagers/ChatManagerDB.js";

const routerMessage = Router();

//CREATE
routerMessage.post('/chat', ChatManagerDB.createChat);

routerMessage.get('/chat', ChatManagerDB.get)
  

export default routerMessage;
