import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = 'products' //Asi es como se llamará mi colección de productos en mi BD

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
    category: {
        type: String,
        enum: ['Diet', 'Salud_Belleza', 'Celíacos', 'Diabéticos']
    } ,
    thumbnails: String
}, { timestamps: true })

prodSchema.plugin(mongoosePaginate);

export const ProductsModel = mongoose.model(productsCollection, prodSchema);