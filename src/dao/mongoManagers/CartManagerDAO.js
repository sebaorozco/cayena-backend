import { CartsModel } from "../models/cart.model.js"
import { ProductsModel } from "../models/product.model.js";

class CartManagerDAO {
    //CREO EL CARRITO
    static async createCart(body) {
        try {
            return await CartsModel.create(body);
        } catch (error) {
            return null;
        }
    }
    
    //LLAMO A TODOS LOS CARRITOS
    static async getCarts() {
        try {
            return await CartsModel.find();
        } catch (error) {
            return null;
        }
    }

    //OBTENGO UN CARRITO POR SU ID
    static async getCartById(cid) {
        try {
            return await CartsModel.findById(cid).populate('products.product_id');
        } catch (error) {
            return null;
        }   
    }
    
    //ELIMINO UN CARRITO POR ID: PASA POR PARAMS CID
    static async deleteCartById(cid) {
        try {
            return await CartsModel.findByIdAndDelete(cid);
        } catch (error) {
            return null;
        }
    }

    //AGREGO UN PROD AL CART
    static async addToCart(productId) {
        try {
          return await ProductsModel.find(item => item._id === productId);
        } catch (error) {
          console.error('Error al agregar al carrito:', error);
        }
      }
  }  
  
  export default CartManagerDAO;