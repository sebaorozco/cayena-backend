import { CartsModel } from "../models/cart.model.js"

class CartManagerDAO {
    //CREO EL CARRITO
    static async createCart(req, res) {
        const { body } = req;
        const result = await CartsModel.create(body);
        res.status(201).json(result);
    }
    
    //LLAMO A TODOS LOS CARRITOS
    static async getCarts(req, res) {
        const result = await CartsModel.find();
        res.status(200).json(result);
    }

    //OBTENGO UN CARRITO POR SU ID
    static async getCartById(req, res) {
        const { params: { cid } } = req;
        const result = await CartsModel.findById(cid);
        if (!result) {
            return res.status(404).end()
        }
        res.status(200).json(result);
    }

    //AGREGO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR PARAMS EL PID Y CID
    static async addProductToCart(req, res) {
        const { pid, cid } = req.params;
        try {
            let cart = await CartsModel.findById(cid).populate('products.product_id')
            if (!cart) {
                return res.status(404).json({ message: "Cart not Found" });
            }
            const productIndex = cart.products.findIndex((p) => p.product_id._id.toString() === pid);
            console.log(productIndex)
            if (productIndex >= 0) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product_id: pid });
            }
            await cart.save();
            return res.status(200).json(cart);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "SERVER ERROR" });
        }
    }

    //AGREGO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR PARAMS EL PID Y CID
    static async addProductToCartFromBody(req, res) {
        try {
            const { cid } = req.params;
            const { product_id } = req.body;
            
            const cart = await CartsModel.findOne({ _id: cid });
            cart.products.push({ product_id });
            
            const response = await CartsModel.updateOne({ _id: cid }, cart);
            res.json({response});
        } catch (error) {
            res.json({ error });
        }
    }

    //ELIMINO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR PARAMS SOLO EL PID Y CID
    static async removeProductFromCart(req, res) {
        const { pid, cid } = req.params;
  
        try {
            const cart = await CartsModel.findById(cid);
            if (!cart) {
                return res.status(404).json({ message: "CART NOT FOUND" });
            }
            const productIndex = cart.products.findIndex((p) => p.product_id.toString() === pid);
            if (productIndex >= 0) {
                cart.products[productIndex].quantity -= 1;
            if (cart.products[productIndex].quantity === 0) {
                cart.products.splice(productIndex, 1);
            }
            await cart.save();
            return res.status(200).json(cart);
            } else {
                return res.status(404).json({ message: "PRODUCT NOT FOUND" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "SERVER ERROR" });
        }
    }
    
    //ELIMINO UN CARRITO POR ID: PASA POR PARAMS CID
    static async deleteCartById(req, res) {
        const { cid } = req.params;
  
        try {
            const result = await CartsModel.findByIdAndDelete(cid);
            if (!result) {
                return res.status(404).json({ message: "CART NOT FOUND" });
            }
            return res.status(200).json({ message: "CART DELETED" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "SERVER ERROR" });
        }
    }
  
  }  
  
  export default CartManagerDAO;