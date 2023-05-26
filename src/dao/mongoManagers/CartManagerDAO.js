import { CartsModel } from "../models/cart.model.js"

class CartManagerDAO {
    //CREO EL CARRITO
    static async createCart(body) {
        return await CartsModel.create(body);
    }
    
    //LLAMO A TODOS LOS CARRITOS
    static async getCarts() {
        const result = await CartsModel.find();
        return result;
    }

    //OBTENGO UN CARRITO POR SU ID
    static async getCartById(cid) {
        const result = await CartsModel.findById(cid);
        if (!result) {
            return "Cart not found."
        }
        return result;
    }

    //AGREGO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR PARAMS EL PID Y CID
    static async addProductToCartFromParams(pid, cid) {
        
        try {
            let cart = await CartsModel.findById(cid).populate('products.product_id')
            if (!cart) {
                return "Cart not Found";
            }
            const productIndex = cart.products.findIndex((p) => p.product_id._id.toString() === pid);
            console.log(productIndex)
            if (productIndex >= 0) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product_id: pid });
            }
            return await cart.save();
            
        } catch (error) {
            console.log(error);
            return { message: "SERVER ERROR" };
        }
    }

    //AGREGO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR PARAMS EL CID Y POR BODY EL PID
  /*   static async addProductToCartFromBody(cid, cart) {
        try {
            const response = await CartsModel.updateOne({ _id: cid }, cart);
            return response;
        } catch (error) {
            return { message: "ERROR" };
        }
    } */

    //ELIMINO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR PARAMS SOLO EL PID Y CID
    static async removeProductFromCart(pid, cid) {
    
        try {
            const cart = await CartsModel.findById(cid);
            if (!cart) {
                return { message: "CART NOT FOUND" };
            }
            const productIndex = cart.products.findIndex((p) => p.product_id.toString() === pid);
            if (productIndex >= 0) {
                cart.products[productIndex].quantity -= 1;
            if (cart.products[productIndex].quantity === 0) {
                cart.products.splice(productIndex, 1);
            }
            return await cart.save();
            
            } else {
                return { message: "PRODUCT NOT FOUND" };
            }
        } catch (error) {
            console.log(error);
            return { message: "SERVER ERROR" };
        }
    }
    
    //ELIMINO UN CARRITO POR ID: PASA POR PARAMS CID
    static async deleteCartById(cid) {
  
        try {
            const result = await CartsModel.findByIdAndDelete(cid);
            if (!result) {
                return { message: "CART NOT FOUND" };
            }
            return { message: "CART DELETED" };
        } catch (error) {
            console.log(error);
            return { message: "SERVER ERROR" };
        }
    }
  
  }  
  
  export default CartManagerDAO;