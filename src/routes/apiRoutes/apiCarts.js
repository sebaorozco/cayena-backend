import { Router } from "express";
import { addProductToCartFromParams, createCart, deleteCartById, getCartById, getCarts, purchase, removeProductFromCart } from "../../controllers/controller.carts.js";

const router = Router();

//CREATE
router.post('/', createCart);

// OBTENGO CARRITOS
router.get('/', getCarts);

// OBTENGO CARRITO POR ID
router.get('/:cid', getCartById);


// AGREGO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR PARAMS SOLO EL PID Y CID
router.put('/:cid/products/:pid', addProductToCartFromParams);

// ELIMINA UN PRODUCTO ESPECÍCO DE UN CARRITO
router.delete('/:cid/products/:pid', removeProductFromCart);

// ELIMINA UN CARRITO POR ID
router.delete('/:cid', deleteCartById);

// FINALIZAR LA COMPRA
router.post('/:cid/purchase', purchase);

export default router;