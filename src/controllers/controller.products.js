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
        if(req.user.role === 'admin'){
            isAdminUser = req.user.role;
        } else if (req.user.role === 'premium'){
            isPremiumUser = req.user.role;
            } else {
                    isUser = req.user.role;
        }

        // Obtengo el producto actual
        const expectedProduct = await ProductManagerDAO.getProductById({ _id: pid });
        if(!expectedProduct){
            throw new Exception('Product not found', 404);
        }

        // Verifico permisos de modificación de producto 
        if (!(isAdmin || (isPremiumUser && expectedProduct.owner === req.user.email))) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar este producto' });
        }

        await ProductManagerDAO.updateProductById({ _id: pid }, updateProductInfo);
        const data = await ProductManagerDAO.getProductById(pid);
        res.status(200).json({ message: 'Producto actualizado exitosamente: ', data });
    } catch (error) {
        next(error)
    }
}

export const deleteProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;

        // Chequeo que rol tiene el usuario
         if(req.user.role === 'admin'){
            isAdminUser = req.user.role;
        } else if (req.user.role === 'premium'){
            isPremiumUser = req.user.role;
            } else {
                    isUser = req.user.role;
        }

        // Obtengo el producto actual
        const expectedProduct = await ProductManagerDAO.getProductById({ _id: pid });
        if(!expectedProduct){
            throw new Exception('Product not found', 404);
        }

        // Verifico permisos de eliminación del producto 
        if (!(isAdmin || product.owner === req.user.email)) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
        }

        const result = await ProductManagerDAO.deleteProductById({ _id: pid });
        res.json({ message: 'Deleted product!:', result})
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