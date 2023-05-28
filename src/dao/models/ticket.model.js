import mongoose from "mongoose";

const ticketCollection = 'tickets' //Asi es como se llamará mi colección de tickets en mi BD

const ticketSchema = new mongoose.Schema({
    //Aqui escribo todas las propiedades que tendrá un usuario en mi BD
    code: {
      type: String,
      unique: true
    },
    purchase_datetime: {
      type: Date,
      default: Date.now
    },
    amount: Number,
    purchaser: { 
        type: String, 
        unique: true, 
        validate: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, 
        ref: "users",
        require: true
    }
}, { timestamps: true })

ticketSchema.pre('find', function(){
  this.populate('user');
})

export const TicketsModel = mongoose.model(ticketCollection, ticketSchema);