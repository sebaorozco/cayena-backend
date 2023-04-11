import { Router } from "express";
import ProductManagerDAO from "../dao/mongoManagers/ProductManagerDAO.js";
import uploader from '../utils/multer.utils.js';

const router = Router();

//CREATE

router.post('/', uploader.single('image'),async (req, res) => {
    try {
        const {title, description, code, stock, category} = req.body;
        const productInfo = {
            title,
            description,
            code,
            stock,
            category,
            thumbnails: req.file.filename
        }
        const newProduct = await ProductManagerDAO.createProduct(productInfo);
        res.status(201).json({message: newProduct});   
    } catch (error) {
        res.json({ error: error.message });
    }
})

//READ

router.get('/', async (req, res) => {
    try {
       const products = await ProductManagerDAO.getAllProducts();
        res.status(201).json(products);
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.get('/:pid', ProductManagerDAO.getProductById)

// UPDATE
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, code, stock, category } = req.body;
        const updateProductInfo = {
            title,
            description,
            code,
            stock,
            category
        } 
        const updateProduct = await ProductManagerDAO.updateProductById({ _id: pid }, updateProductInfo);
        res.status(204).json({updateProduct});
    } catch (error) {
        res.status(400).json("No se puede eliminar un Producto inexistente.")
    }
})

// DELETE
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await ProductManagerDAO.deleteProductById({ _id: pid });
        res.status(204).json('Producto Eliminado!');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

export default router; 