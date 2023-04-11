import { Router } from "express";
import CartManagerDAO from "../dao/mongoManagers/CartManagerDAO.js";

const router = Router();

//CREATE
router.post('/', CartManagerDAO.createCart);

// READ
router.get('/', CartManagerDAO.getCarts);
router.get('/:cid', CartManagerDAO.getCartById);

// UPDATE
router.put('/:cid/products/:pid', CartManagerDAO.addProductToCart);

// DELETE
router.delete('/:cid', CartManagerDAO.deleteCartById)

export default router;