import mongoose from "mongoose";

const cartCollection = 'carts' //Asi es como se llamará mi colección de carritos en mi BD

const cartSchema = new mongoose.Schema({
    //Aqui escribo todas las propiedades que tendrá un carrito en mi BD
    products: [{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            require: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
}, { timestamps: true });
      
export const cartModel = mongoose.model(cartCollection, cartSchema);