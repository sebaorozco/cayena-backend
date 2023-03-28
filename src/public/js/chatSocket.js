import { Server } from 'socket.io';
import { messageModel } from '../../dao/models/message.model.js';


let io

export const initChat = (httpServer) => {
    io = new Server(httpServer)

    io.on('connection', async (socketClient) => {
        console.log('Nuevo cliente conectado', socketClient.id)

        socketClient.on('new-message', async (data) => {
            const mensaje = await messageModel.create(data)
            io.emit('notification', mensaje)
        })
        socketClient.on('disconection', () => {
            console.log('Se desconectó el cliente con el id', socketClient.id)
        })
  })

}

export const emit = (mensaje) => {
  io.emit('notification', mensaje)
}