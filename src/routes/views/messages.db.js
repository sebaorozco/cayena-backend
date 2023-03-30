import { Router } from 'express';
import { messageModel } from '../../dao/models/message.model.js';

const routerMessageView = Router()

routerMessageView.get('/', async (req, res) => {
  const mensajes = await messageModel.find().lean()
  const scripts = { socket: '/socket.io/socket.io.js', index: 'js/script.js', mensajes: mensajes}
  res.render('chat', scripts)
})

export default routerMessageView;