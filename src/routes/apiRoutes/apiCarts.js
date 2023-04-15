import { Router } from "express";
import CartManagerDAO from "../../dao/mongoManagers/CartManagerDAO.js";
import { CartsModel } from "../../dao/models/cart.model.js";

const router = Router();

//CREATE
router.post('/', CartManagerDAO.createCart);

// READ
router.get('/', CartManagerDAO.getCarts);
router.get('/:cid', CartManagerDAO.getCartById);

// AGREGO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR PARAMS SOLO EL PID Y CID
router.put('/:cid/products/:pid', CartManagerDAO.addProductToCart);

// ELIMINA UN PRODUCTO ESPECÍCO DE UN CARRITO

router.delete('/:cid/products/:pid', CartManagerDAO.removeProductFromCart);

// AGREGA UN PRODUCTO A UN CARRITO ESPECÍFICO, TOMANDO EL id DEL PRODUCTO DESDE EL BODY
router.put('/:cid', async (req, res) => {
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
}) 

// DELETE
router.delete('/:cid', CartManagerDAO.deleteCartById)

export default router;