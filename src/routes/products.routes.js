// Importar las dependencias
import { Router } from 'express';
import ProductManager from '../components/ProductManager.js';

const product = new ProductManager;

// Instanciar las constantes de nuestras rutas
const productsRouter = Router();

// Vamos a crear nuestro endpoint de Productos

productsRouter.get('/', async (req, res) => {
    // Agrego el soporte para recibir por query param el valor limite de resultados
    let limit = parseInt(req.query.limit);

    if(!limit) return res.send(await product.getProducts());
    let arrayProd = await product.readProducts();
    let prodLimit = arrayProd.slice(0, limit);
    res.send(await prodLimit);
})

productsRouter.get('/:pid', async (req, res) => {
    let pid = parseInt(req.params.pid);
    res.send(await product.getProductById(pid));
})

productsRouter.post('/', async (req, res) => {
    let newProduct = req.body;
    res.send(await product.addProducts(newProduct));
})

productsRouter.put('/:pid', async (req, res) => {
    let pid = parseInt(req.params.pid);
    let updateProduct = req.body;
    res.send(await product.updateProductById(pid, updateProduct));
})

productsRouter.delete('/:pid', async (req, res) => {
    let pid = parseInt(req.params.pid);
    res.send(await product.deleteProductById(pid));
})

export default productsRouter;