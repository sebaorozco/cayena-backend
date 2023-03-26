import { Router } from "express";
import { prodModel } from "../models/product.model.js";

const router = Router();

//CREATE
router.post('/products', async (req, res) => {
    const { body } = req;
    const newProduct = await prodModel.create(body);
    res.status(201).json(newProduct);
})

// READ
router.get('/products', async (req, res) => {
    try {
        let products = await prodModel.find();
        res.status(200).json(products);
    } catch (error) {
        console.log("Cannot get products with mongoose: "+ error);
    }
})

// UPDATE
router.put('/products/:pid', async (req, res) => {
    const { params: { pid }, body } = req;
    const updateProduct = await prodModel.updateOne({ _id: pid }, { $set: body });
    res.status(204).json(updateProduct);
})

// DELETE
router.delete('/products/:pid', async (req, res) => {
    const { params: { pid } } = req;
    const deleteProduct = await prodModel.deleteOne({ _id: pid });
    res.status(204).json(deleteProduct);
})

export default router;