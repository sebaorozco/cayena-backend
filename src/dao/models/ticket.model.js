import mongoose from "mongoose";

const ticketCollection = 'tickets' //Asi es como se llamará mi colección de tickets en mi BD

const ticketSchema = new mongoose.Schema({
    //Aqui escribo todas las propiedades que tendrá un usuario en mi BD
    code: String,
    purchase_datetime: {timestamps: true},
    amount: Number,
    purchaser: { 
        type: String, 
        unique: true, 
        validate: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/  },
        ref: "users",
        require: true
}, { timestamps: true })

ticketSchema.pre('find', function(){
  this.populate('user');
})

export const TicketsModel = mongoose.model(ticketCollection, ticketSchema);