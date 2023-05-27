import { Router } from 'express'
import { authJWTMiddleware } from '../../utils/index.js';
import { createMessage, deleteMessageById, getMessageById, getMessages, updateMessageById } from '../../controllers/controller.chat.js';


const router = Router()

  //MUESTRO MENSAJES DESDE LA BD
  router.get('/', getMessages);

  //POSTEAR MENSAJES EN LA BD
  router.post('/', authJWTMiddleware(['user']), createMessage);

  //MOSTRAR MENSAJE POR ID
  router.get('/:mid', getMessageById);

  //MODIFICO MENSAJE POR ID
  router.put('/:mid', updateMessageById);

  //ELIMINAR MENSAJES POR ID
  router.delete('/:mid', deleteMessageById)

export default router;