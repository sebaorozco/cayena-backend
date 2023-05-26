import ProductManagerDAO from "../dao/mongoManagers/ProductManagerDAO.js";
import commonsUtils from "../utils/common.js";

export const getAllProducts = async (req, res) => {
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
}

export const getProductById = async (req, res) => {
    try {
        const { params: { pid } } = req;
        const expectedProduct = await ProductManagerDAO.getProductById({ _id: pid });
        res.json({ expectedProduct });
       
    } catch (error) {
        res.json({ error: error.message });
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const { params: { cat } } = req;
        const category = await ProductManagerDAO.getProducstByCategory({category: cat});
        res.json({ category });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export const createProduct = async (req, res) => {
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
}

export const updateProductById = async (req, res) => {
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
}

export const deleteProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        await ProductManagerDAO.deleteProductById({ _id: pid });
        res.status(204).json({ message: 'Producto Eliminado!'})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const deleteAllProducts = async (req, res) => {
    try {
        await ProductManagerDAO.deleteAllProducts();
        res.status(204).json({message: 'Productos Eliminados'});
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
}