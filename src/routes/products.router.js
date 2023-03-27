import { Router } from "express";
import ProductManagerDB from "../dao/mongoManagers/productManagerDB.js";

const router = Router();

//CREATE
router.post('/products', ProductManagerDB.create);

// READ
router.get('/products', ProductManagerDB.get);
router.get('/products/:pid', ProductManagerDB.getById);

// UPDATE
router.put('/products/:pid', ProductManagerDB.updateById);

// DELETE
router.delete('/products/:pid', ProductManagerDB.deleteById)

export default router;