import { ProductManagerDAO } from "../dao/factory.js";
import commonsUtils from "../utils/common.js";
import Exception from "../utils/exception.js";

export const getAllProducts = async (req, res, next) => {
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

export const getProductById = async (req, res, next) => {
    try {
        const { params: { pid } } = req;
        const expectedProduct = await ProductManagerDAO.getProductById({ _id: pid });
        if(!expectedProduct){
            throw new Exception('Product not found', 404);
        }
        res.json({ expectedProduct });
       
    } catch (error) {
        next(error);
    }
}

export const getProductsByCategory = async (req, res, next) => {
    try {
        const { params: { cat } } = req;
        const expectedProducts = await ProductManagerDAO.getProducstByCategory(cat);
        console.log(expectedProducts);
        if(!expectedProducts || expectedProducts.length == 0){
            throw new Exception('Category not found', 404);
        }
        res.json({ expectedProducts });
    } catch (error) {
        next(error);
    }
}

export const createProduct = async (req, res, next) => {
    try {
        const {title, description, code, price, stock, category} = req.body;
        
        if (req.user.role === 'premium'){
            let owner = req.user.email;
        } else {
            let owner = 'admin';
        }
        
        const productInfo = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: req.file.filename,
        }
        
        const newProduct = await ProductManagerDAO.createProduct(productInfo);
        res.status(201).json({message: newProduct});   
    } catch (error) {
        next(error);
    }
}

export const updateProductById = async (req, res, next) => {
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
        const expectedProduct = await ProductManagerDAO.getProductById({ _id: pid });
        if(!expectedProduct){
            throw new Exception('Product not found', 404);
        }
        await ProductManagerDAO.updateProductById({ _id: pid }, updateProductInfo);
        const data = await ProductManagerDAO.getProductById(pid);
        res.json({ message: data });
    } catch (error) {
        next(error)
    }
}

export const deleteProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const expectedProduct = await ProductManagerDAO.getProductById({ _id: pid });
        if(!expectedProduct){
            throw new Exception('Product not found', 404);
        }
        const result = await ProductManagerDAO.deleteProductById({ _id: pid });
        res.json({ message: 'Deleted product!'})
    } catch (error) {
        next(error);
    }
}

export const deleteAllProducts = async (req, res) => {
    try {
        await ProductManagerDAO.deleteAllProducts();
        res.status(204).json({message: 'Productos Eliminados'});
    } catch (error) {
        next(error);
    }
}