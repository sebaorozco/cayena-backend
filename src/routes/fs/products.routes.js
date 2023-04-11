// Importar las dependencias
import { Router } from 'express';
import ProductManager from '../../dao/fsManagers/ProductManager.js';

// Instanciar las constantes de nuestras rutas
const productsRouter = Router();

const product = new ProductManager;

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
    const { title, description, code, price, status, stock, category, thumbnails }  = req.body;
    const newProduct = await product.addProducts({
        id: Date.now(),
        title, 
        description, 
        code, 
        price, 
        status: true, 
        stock, 
        category, 
        thumbnails:[]
    })
    res.send(newProduct);
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