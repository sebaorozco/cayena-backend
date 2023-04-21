import mongoose from "mongoose";

const userCollection = 'users' //Asi es como se llamará mi colección de usuarios en mi BD

const userSchema = new mongoose.Schema({
    //Aqui escribo todas las propiedades que tendrá un usuario en mi BD
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario',
      },
}, { timestamps: true })

export const UsersModel = mongoose.model(userCollection, userSchema);