import { Router } from "express";
import CartManagerDB from "../dao/mongoManagers/CartManagerDB.js";

const routerCarts = Router();

//CREATE
routerCarts.post('/carts', CartManagerDB.createCarts);

// READ
routerCarts.get('/carts', CartManagerDB.getCarts);
routerCarts.get('/carts/:pid', ProductManagerDB.getById);

// UPDATE
routerCarts.put('/carts/:pid', ProductManagerDB.updateById);

// DELETE
routerCarts.delete('/carts/:pid', ProductManagerDB.deleteById)

export default routerCarts;
