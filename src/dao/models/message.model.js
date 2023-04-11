import mongoose from 'mongoose';
    
const messageCollection = 'messages' //Asi es como se llamará mi colección de mensajes del chat en mi BD
    
const messageSchema = new mongoose.Schema({
    //Aqui escribo todas las propiedades que tendrá un mensaje en mi BD
    name: { type: String, require: true },
    mail: { type: String, require: true },
    message: { type: String, require: true }
}, { timestamps: true })
              
export const MessagesModel = mongoose.model(messageCollection, messageSchema);