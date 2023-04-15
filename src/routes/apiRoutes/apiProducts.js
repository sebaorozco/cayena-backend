import { Router } from "express";
import ProductManagerDAO from "../../dao/mongoManagers/ProductManagerDAO.js";
import commonsUtils from "../../utils/common.js";
import uploader from "../../utils/multer.utils.js";
import { ProductsModel } from "../../dao/models/product.model.js";
//import { ProductsModel } from "../../dao/models/product.model.js";
//import commonsUtils2 from "../../utils/common2.js";

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

// READ

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

// Obtengo un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const { params: { pid } } = req;
        const expectedProduct = await ProductManagerDAO.getProductById({ _id: pid });
        res.json({ expectedProduct });
       
    } catch (error) {
        res.json({ error: error.message });
    }
})

// Obtengo un producto por Category
router.get('/category/:cat', async(req, res) => {
    try {
        const { cat } = req.params;
        const result = await ProductsModel.find({category: cat});
        console.log(result)
        res.status(201).json({payload: result});
    } catch (error) {
        res.json({ error: error.message });
    }
}) 

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
        await ProductManagerDAO.updateProductById({ _id: pid }, updateProductInfo);
        const data = await ProductManagerDAO.getProductById(pid);
        res.json({ message: data });
    } catch (error) {
        res.status(400).json("No se puede actualizar un Producto inexistente.")
    }
})

// DELETE -elimino un producto por su id
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await ProductManagerDAO.deleteProductById({ _id: pid });
        res.status(204).json('Producto Eliminado!');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

// DELETE all Products

router.delete('/', async (req, res) => {
    try {
        await ProductManagerDAO.deleteAllProducts();
        res.status(204).json({message: 'Productos Eliminados'});
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
})

export default router; 