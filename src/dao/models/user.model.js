import mongoose from "mongoose";

const userCollection = 'users' //Asi es como se llamará mi colección de usuarios en mi BD

const userSchema = new mongoose.Schema({
    //Aqui escribo todas las propiedades que tendrá un usuario en mi BD
    name: String,
    email: { type: String, unique: true, validate: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/  },
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user',
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "carts",
        require: true
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tickets"
    } 
}, { timestamps: true })

userSchema.pre('find', function(){
  this.populate('cart');
})

export const UsersModel = mongoose.model(userCollection, userSchema);