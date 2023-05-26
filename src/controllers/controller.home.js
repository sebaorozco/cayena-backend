import { Router } from "express";
import { ProductManagerDAO } from "../dao/factory.js";

const router = Router();
const product = new ProductManagerDAO;

// Enviamos la lista de todos los productos usando Handlebars y FS
router.get('/', async (req, res) => {
    let allProducts = await product.getProducts();
    res.render('home', {
        title: "Cayena - Almacén Orgánico y Natural",
        products: allProducts
    })
}) 


// Enviamos la lista de todos los productos usando WEBSOCKETS y FS
router.get('/realtimeproducts', async (req, res) => {
    let products = await product.getProducts();
    res.render('realTimeProducts', {
        title: "Cayena - Almacén Orgánico y Natural",
        products: products
    });
})

router.post('/realtimeproducts', async (data) => {
    await product.addProducts(data);
})

export default router;