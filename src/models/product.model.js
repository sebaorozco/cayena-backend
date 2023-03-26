import mongoose from "mongoose";

const prodCollection = 'products' //Asi es como se llamará mi colección de productos en mi BD

const prodSchema = new mongoose.Schema({
    //Aqui escribo todas las propiedades que tendrá un producto en mi BD
    title: String,
    description: String,
    code: {
        type: String,
        unique: true
    },
    price: Number,
    status: {
        type: Boolean,
        default: true
    },
    stock: Number,
    category: String,
    thumbnails: String
}, { timestamps: true })

export const prodModel = mongoose.model(prodCollection, prodSchema);