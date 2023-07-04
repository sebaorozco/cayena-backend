import { ProductManagerDAO, CartManagerDAO, TicketManagerDAO } from "../dao/factory.js"
import twilioServices from "../services/twilio.services.js";
import Exception from "../utils/exception.js";
import { calculateTotal, generateCode } from "../utils/index.js";

export const getCarts = async (req, res, next) => {
    try {
        const carts = await CartManagerDAO.getCarts();
        res.status(201).json({ status: 'success', carts })
    } catch (error) {
        next(error);
    }
}

export const getCartById = async (req, res, next) => {
    try {
        const { params: { cid } } = req;
        const expectedCart = await CartManagerDAO.getCartById(cid);
        if (!expectedCart) {
            throw new Exception('Cart not found', 404);
        }
        res.json({ expectedCart });
    } catch (error) {
        next(error);
    }
}

export const createCart = async (req, res) => {
    try {
        const { body } = req
        const newCart = await CartManagerDAO.createCart(body)
        res.status(201).json({success: true, payload: newCart});
    } catch (error) {
        res.json({ error: error.message });
    }
}

export const addProductToCartFromParams = async (req, res, next) => {
    try {
        const { pid, cid } = req.params;
        const currentUser = req.user; // Obtengo el usuario actual

        // Obtengo el carrito en cuestión
        const cart = await CartManagerDAO.getCartById(cid);
        if(!cart){
            throw new Exception('Cart not found', 404);
        }
        
        // Obtengo el producto en cuestión
        const prod = await ProductManagerDAO.getProductById(pid);
        if(!prod){
            throw new Exception('Product not found.', 404);
        }

        // Verifico el rol del usuario actual
        const rol = ["admin", "premium", "user"];
        if (!rol.includes(currentUser.role)) {
            return res.status(403).json({ message: "Invalid user role." });
        }

        // Verifico si el usuario actual es "premium" y si el producto le pertenece
        if (
            currentUser.role === "premium" &&
            prod.owner &&
            prod.owner === currentUser.email
        ) {
            return res.status(403).json({ message: "Premium users cannot add their own products to the cart."});
        }

        const productIndex = cart.products.findIndex((p) => p.product_id._id.toString() === pid);
        //console.log(productIndex)
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product_id: pid });
        }
        await cart.save();
        res.json({success: true, message: "Product added."});
    } catch (error) {
        next(error);
    }
}

export const removeProductFromCart = async (req, res, next) => {
    try {
        const { pid, cid } = req.params;
        const cart = await CartManagerDAO.getCartById(cid);
        //console.log(cart)
        if(!cart){
            throw new Exception('Cart not found', 404);
        }
        /* const prod = await ProductManagerDAO.getProductById(pid);
        if(!prod){
            throw new Exception('Product not found', 404);
        } */
        const productIndex = cart.products.findIndex((p) => p.product_id._id.toString() === pid);
        if (productIndex >= 0) {
            cart.products[productIndex].quantity -= 1;
            if (cart.products[productIndex].quantity === 0) {
                cart.products.splice(productIndex, 1);
            }
            await cart.save();
            res.json({ success: true, message: "Product removed."})
            } else {
                throw new Exception('Product not found', 404);
        }
    } catch (error) {
        next(error);
    }
}

export const deleteCartById = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const expectedCart = await CartManagerDAO.getCartById(cid);
        if(!expectedCart){
            throw new Exception('Cart not found', 404);
        }
        await CartManagerDAO.deleteCartById(cid)
        res.json({ success: true, message: "Cart deleted."})
    } catch (error) {
        next(error);
    }   
}

export const purchase = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const cart = await CartManagerDAO.getCartById(cid);
        if(!cart){
            throw new Exception('Cart not found', 404);
        }
       
        if(cart.products.length <= 0){
            throw new Exception('Empty cart', 404);
        } else {

            const purchasedProducts = [];
            const returnedProducts = [];
            
            for (const item of cart.products) {
                const product = item.product_id;
                const quantity = item.quantity;
                
                if (product.stock >= quantity) {
                  product.stock -= quantity;
                  await product.save();
                  purchasedProducts.push(item);
                } else {
                    returnedProducts.push(item);
                }
            }
            // Creo el ticket de compra

            const code = generateCode(); // Genera un código único
            const amount = calculateTotal(purchasedProducts); // Calcula el total de la compra
            const purchaser = 'email@email.com';
            console.log('Ticket de compra: ', code, amount, purchaser)
            
            await TicketManagerDAO.createTicket(code, amount, purchaser);
            
            // Envío sms al cliente
            const nombre = purchaser;
            const clientPhone = '+543854160596'
            const body = `Gracias ${nombre}, tu solicitud de compra ha sido aprobada. `
            const result2 = await twilioServices.sendSMS(clientPhone, body)
            console.log('SMS enviado al cliente:',result2);
    
            // Actualizar el carrito con los productos no comprados
            cart.products = returnedProducts;
            await cart.save();
    
            return res.json({ purchasedProducts, returnedProducts });
        }

    } catch (error) {
        next(error);
    }
}