import { Router } from "express";
import commonsUtils from "../../utils/common.js";
import { authJWTMiddleware, authMiddleware } from "../../utils/index.js";
import { ProductManagerDAO, UserManagerDAO } from "../../dao/factory.js";
import emailServices from "../../services/email.services.js";

const router = Router();

// OBTENGO TODOS LOS PRODUCTOS
router.get('/', authMiddleware('jwt'), async (req, res) => {
    try {
        const {query: {limit= 10, page= 1, sort}} = req;
        const options = {
            limit,
            page
        }
        if(sort){
            options.sort = { price: sort }
        }
        const userRole = req.user.role;
        if(userRole === 'admin' || userRole === 'premium'){
            const result = await ProductManagerDAO.getAllProducts(options);
            res.status(201).render('products', commonsUtils.buildResponse({...result, sort}));
        } else {
            res.render('errors', { error: 'Forbidden. You are not an admin or premium user.'})
        }
    } catch (error) {
        res.json({ error: error.message });
    }
})

// Obtengo un producto por Category
router.get('/category/:cat', async (req, res) => {
    try {
        const { cat } = req.params;
        const {query: {limit= 10, page= 1, sort}} = req;
        const options = {
            limit,
            page
        }
        if(sort){
            options.sort = { price: sort }
        }
        const filteredProd = await ProductManagerDAO.getProducstByCategory(cat);
        const result = {...filteredProd, sort, cat}
        res.status(201).render('productsByCategory', commonsUtils.buildResponse({ payload: result}));
    } catch (error) {
        res.json({ error: error.message });
    }
}) 

// MARKETPLACE-COMPRAS
router.get('/marketplace', async (req, res) => {
    try {
        const result = await ProductManagerDAO.getAllProducts();
        res.status(201).render('marketplace', { product: result.docs });
    } catch (error) {
        res.json({ error: error.message });
    }
})

router.post('/delete-product/:pid', authMiddleware('jwt'), async (req, res, next) => {
    try {
        const { pid } = req.params;
    
        // Chequeo que rol tiene el usuario
        const isAdmin = req.user.role === 'admin';
        const isPremiumUser = req.user.role === 'premium';
    
        // Obtengo el producto actual
        const expectedProduct = await ProductManagerDAO.getProductById({ _id: pid });
        if(!expectedProduct){
            res.render('errors', { error: 'Product not found.'})
        }
    
        // Verifico permisos de eliminación del producto. 
        // Si es Admin puede eliminar cualquier producto. 
        // Pero si ese prod. pertenece a un user premium deberá notificarlo vía email.
        if (isAdmin){
            console.log("Es admin user: ", isAdmin)
    
            // Verifico si el prod. pertenece a un usuario Premium
            const ownerEmail = expectedProduct.owner
        
            const ownerUser = await UserManagerDAO.getUserByEmail({ email: ownerEmail });

            if (!ownerUser){
                return res.status(400).render('errors', { error: 'User not found!'}) 
            }
    
            if (ownerUser.role === 'premium') {
                const deletedProduct = expectedProduct;
                const result = await ProductManagerDAO.deleteProductById({ _id: pid });
    
                // Enviar correo electrónico al usuario premium propietario del producto
                const userEmail = expectedProduct.owner;
                const emailSubject = 'Eliminación de tu producto';
                const emailHtml = `<p>Estimado usuario premium: ${ownerUser.name},</p>
                                <p>Tu producto ${deletedProduct.title} ha sido eliminado por un administrador.</p>
                                <p>Atentamente</p>
                                <p>Cayena Almacén Orgánico y Natural.</p>`;
                await emailServices.sendEmail(userEmail, emailSubject, emailHtml);
    
                return res.status(200).render('messages', { message: `Producto ${deletedProduct.title} eliminado y correo electrónico enviado.` });
            }
    
            // Si elproducto a eliminar no es de un usuario premium eliminar sin enviar correo.
            const deletedProduct = expectedProduct;
            const result = await ProductManagerDAO.deleteProductById({ _id: pid });
            return res.render('messages', { message: `Se eliminó el producto ${deletedProduct.title}`});
        } else if (isPremiumUser) {
            console.log("Es premium user? ", isPremiumUser)
            // Verificar si el producto pertenece al usuario premium
            if (expectedProduct.owner === req.user.email) {
                const deletedProduct = expectedProduct;
                const result = await ProductManagerDAO.deleteProductById({ _id: pid });
                return res.render('messages', { message: `Se eliminó el producto ${deletedProduct.title}` });
            } else {
                return res.status(403).render('errors', { message: 'Forbidden, you do not have permission to delete this product.' });
            }
        }
        return res.status(403).render('errors', { message: 'Forbidden, you do not have permission to delete this product.' });
    } catch (error) {
        next(error);
    }

})

export default router; 