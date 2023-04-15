import mongoose from "mongoose";

const cartCollection = 'carts' //Asi es como se llamará mi colección de carritos en mi BD

const cartSchema = new mongoose.Schema({
    //Aqui escribo todas las propiedades que tendrá un carrito en mi BD
    title: String,
    products: {
        type: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: [],
    } 
}, { timestamps: true });

cartSchema.pre('find', function(){
    this.populate('products.product_id');
})
      
export const CartsModel = mongoose.model(cartCollection, cartSchema);