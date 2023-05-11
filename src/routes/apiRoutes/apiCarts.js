import { Router } from "express";
import CartManagerDAO from "../../dao/mongoManagers/CartManagerDAO.js";

const router = Router();

//CREATE
router.post('/', CartManagerDAO.createCart);

// READ
router.get('/', CartManagerDAO.getCarts);
router.get('/:cid', CartManagerDAO.getCartById);

// AGREGO UN PRODUCTO EN UN CARRITO EN ESPECIFICO: PASA POR PARAMS SOLO EL PID Y CID
router.put('/:cid/products/:pid', CartManagerDAO.addProductToCart);

// AGREGA UN PRODUCTO A UN CARRITO ESPECÍFICO, TOMANDO EL id DEL PRODUCTO DESDE EL BODY
router.put('/:cid', CartManagerDAO.addProductToCartFromBody);

// ELIMINA UN PRODUCTO ESPECÍCO DE UN CARRITO
router.delete('/:cid/products/:pid', CartManagerDAO.removeProductFromCart);

// ELIMINA UN CARRITO POR ID
router.delete('/:cid', CartManagerDAO.deleteCartById)

export default router;