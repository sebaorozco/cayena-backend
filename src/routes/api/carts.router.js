import { Router } from "express";
import CartManagerDB from "../../dao/mongoManagers/CartManagerDB.js";

const routerCarts = Router();

//CREATE
routerCarts.post('/carts', CartManagerDB.createCarts);

// READ
routerCarts.get('/carts', CartManagerDB.getCarts);
routerCarts.get('/carts/:cid', CartManagerDB.getCartById);

// UPDATE
routerCarts.put('/carts/:cid/products/:pid', CartManagerDB.addProductToCart);

// DELETE
routerCarts.delete('/carts/:cid', CartManagerDB.deleteCart)

export default routerCarts;
