/*import { Router } from "express";
import ProductManagerDAO from "../dao/mongoManagers/ProductManagerDAO.js";
import uploader from '../utils/multer.utils.js';
import commonsUtils from "../utils/common.js";

const router = Router();

//CREATE

router.post('/', uploader.single('image'),async (req, res) => {
    try {
        const {title, description, code, price, stock, category} = req.body;
        const productInfo = {
            title,
            description,
            code,
            price,
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
        const {query: {limit= 10, page= 1, sort}} = req;
        const options = {
            limit,
            page
        }
        
        const products = await ProductManagerDAO.getAllProducts(options);
        res.status(201).json(commonsUtils.buildResponse(products));
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.get('/:pid', ProductManagerDAO.getProductById)

// UPDATE
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const { title, description, code, price, stock, category } = req.body;
        const updateProductInfo = {
            title,
            description,
            code,
            price,
            stock,
            category
        } 
        const updateProduct = await ProductManagerDAO.updateProductById({ _id: pid }, updateProductInfo);
        res.status(204).json({updateProduct});
    } catch (error) {
        res.status(400).json("No se puede actualizar un Producto inexistente.")
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

export default router; */