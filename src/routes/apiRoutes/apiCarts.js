import { Router } from "express";
import { addProductToCartFromParams, createCart, deleteCartById, getCartById, getCarts, purchase, removeProductFromCart } from "../../controllers/controller.carts.js";
import { authJWTMiddleware } from "../../utils/index.js";

const router = Router();

//CREATE
router.post('/', createCart);

// OBTENGO CARRITOS
router.get('/', authJWTMiddleware(['admin']), getCarts);

// OBTENGO CARRITO POR ID
router.get('/:cid', authJWTMiddleware(['admin', 'user', 'premium']), getCartById);

// AGREGO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR PARAMS SOLO EL PID Y CID
router.put('/:cid/products/:pid', authJWTMiddleware(['admin', 'user', 'premium']), addProductToCartFromParams);

// ELIMINA UN PRODUCTO ESPECÍCO DE UN CARRITO
router.delete('/:cid/products/:pid', authJWTMiddleware(['admin']), removeProductFromCart);

// ELIMINA UN CARRITO POR ID
router.delete('/:cid', authJWTMiddleware(['admin']), deleteCartById);

// FINALIZAR LA COMPRA
router.post('/:cid/purchase', purchase);

export default router;