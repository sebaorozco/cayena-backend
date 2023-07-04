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
        
        const ownerData = req.user.role === 'premium' ? req.user.email : 'admin'
    
        const productInfo = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: req.file.filename,
            owner: ownerData
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
        // Chequeo que rol tiene el usuario
        const isAdmin = req.user.role === 'admin';
        const isPremiumUser = req.user.role === 'premium';

        // Obtengo el producto actual
        const expectedProduct = await ProductManagerDAO.getProductById({ _id: pid });
        if(!expectedProduct){
            throw new Exception('Product not found', 404);
        }

        // Verifico permisos de modificación de producto 
        if ((isPremiumUser & expectedProduct.owner === req.user.email)) {
            console.log("Es premium user? ", isPremiumUser)
            await ProductManagerDAO.updateProductById({ _id: pid }, updateProductInfo);
            const data = await ProductManagerDAO.getProductById(pid);
            return res.status(200).json({ message: 'Producto actualizado exitosamente: ', data });
        } else if (isAdmin){
            console.log("Es admin user: ", isAdmin)
            await ProductManagerDAO.updateProductById({ _id: pid }, updateProductInfo);
            const data = await ProductManagerDAO.getProductById(pid);
            return res.status(200).json({ message: 'Producto actualizado exitosamente: ', data });
        }
        return res.status(403).json({ message: 'Forbidden, you do not have permission to update this product.' });
    } catch (error) {
        next(error)
    }
}

export const deleteProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;

        // Chequeo que rol tiene el usuario
        const isAdmin = req.user.role === 'admin';
        const isPremiumUser = req.user.role === 'premium';

        // Obtengo el producto actual
        const expectedProduct = await ProductManagerDAO.getProductById({ _id: pid });
        if(!expectedProduct){
            throw new Exception('Product not found', 404);
        }

        // Verifico permisos de eliminación del producto 
        if ((isPremiumUser & expectedProduct.owner === req.user.email)) {
            console.log("Es premium user? ", isPremiumUser)
            const result = await ProductManagerDAO.deleteProductById({ _id: pid });
            const deletedProduct = expectedProduct;
            return res.json({ message: 'Deleted product!:', deletedProduct, result})
        } else if (isAdmin){
            console.log("Es admin user: ", isAdmin)
            const deletedProduct = expectedProduct;
            const result = await ProductManagerDAO.deleteProductById({ _id: pid });
            return res.json({ message: 'Deleted product!:', deletedProduct, result})
        }
        return res.status(403).json({ message: 'Forbidden, you do not have permission to delete this product.' });
    } catch (error) {
        next(error);
    }
}

export const deleteAllProducts = async (req, res) => {
    try {
        await ProductManagerDAO.deleteAllProducts();
        res.status(204).json({message: 'All products deleted'});
    } catch (error) {
        next(error);
    }
}