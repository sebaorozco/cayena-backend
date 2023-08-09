import { ProductManagerDAO, UserManagerDAO } from "../dao/factory.js";
import emailServices from "../services/email.services.js";
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

        const productImage = req.files['product'] ? req.files['product'][0] : null;
        
        const ownerData = req.user.role === 'premium' ? req.user.email : 'admin'
    
        const productInfo = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails: productImage.filename,
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

        // Verifico permisos de eliminación del producto. 
        // Si es Admin puede eliminar cualquier producto. 
        // Pero si ese prod. pertenece a un user premium deberá notificarlo vía email.
        if (isAdmin){
            console.log("Es admin user: ", isAdmin)

            // Verifico si el prod. pertenece a un usuario Premium
            const ownerEmail = expectedProduct.owner
            const ownerUser = await UserManagerDAO.getUserByEmail({ email: ownerEmail });
            
            if (ownerUser.role === 'premium') {
                const deletedProduct = expectedProduct;
                const result = await ProductManagerDAO.deleteProductById({ _id: pid });

                // Enviar correo electrónico al usuario premium propietario del producto
                const userEmail = expectedProduct.owner;
                const emailSubject = 'Eliminación de tu producto';
                const emailHtml = `<p>Estimado usuario premium: ${ownerUser.name},</p>
                                <p>Tu producto ${deletedProduct} ha sido eliminado por un administrador.</p>
                                <p>Atentamente</p>
                                <p>Cayena Almacén Orgánico y Natural.</p>`;
                await emailServices.sendEmail(userEmail, emailSubject, emailHtml);

                return res.json({ message: 'Producto eliminado y correo enviado!', deletedProduct, result });
            }

            // Si elproducto a eliminar no es de un usuario premium eliminar sin enviar correo.
            const deletedProduct = expectedProduct;
            const result = await ProductManagerDAO.deleteProductById({ _id: pid });
            return res.json({ message: 'Deleted product!:', deletedProduct, result});
        } else if (isPremiumUser) {
            console.log("Es premium user? ", isPremiumUser)
            // Verificar si el producto pertenece al usuario premium
            if (expectedProduct.owner === req.user.email) {
                const deletedProduct = expectedProduct;
                const result = await ProductManagerDAO.deleteProductById({ _id: pid });
                return res.json({ message: 'Deleted your product!', deletedProduct, result });
            } else {
                return res.status(403).json({ message: 'Forbidden, you do not have permission to delete this product.' });
            }
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