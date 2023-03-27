import { Router } from "express";
import CartManagerDB from "../dao/mongoManagers/CartManagerDB.js";
import ProductManagerDB from "../dao/mongoManagers/productManagerDB.js";

const routerCarts = Router();

//CREATE
routerCarts.post('/carts', CartManagerDB.create);

// READ
routerCarts.get('/carts', ProductManagerDB.get);
routerCarts.get('/carts/:pid', ProductManagerDB.getById);

// UPDATE
routerCarts.put('/carts/:pid', ProductManagerDB.updateById);

// DELETE
routerCarts.delete('/carts/:pid', ProductManagerDB.deleteById)

export default routerCarts;
