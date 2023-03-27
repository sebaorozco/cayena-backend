// Importar las dependencias
import { Router } from 'express';
import CartManager from '../dao/fsManagers/CartManager.js';

const cart = new CartManager;

// Instanciar las constantes de nuestras rutas
const cartsRouter = Router();

// Vamos a crear nuestro endpoint de Carritos
cartsRouter.get('/', async (req, res) => {
    // Agrego el soporte para recibir por query param el valor limite de resultados
    let limit = parseInt(req.query.limit);
    if(!limit) return res.send(await cart.getCarts());
    let arrayProd = await cart.readCarts();
    let cartsLimit = arrayProd.slice(0, limit);
    res.send(await cartsLimit);
})

cartsRouter.get('/:cid', async (req, res) => {
    let cid = parseInt(req.params.cid);
    res.send(await cart.getCartById(cid));
}) 

cartsRouter.post('/', async (req, res) => {
    res.send(await cart.addCarts());
})

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    let cartId = parseInt(req.params.cid);
    let prodId = parseInt(req.params.pid);
    res.send(await cart.productInCart(cartId, prodId));
})

cartsRouter.delete('/:cid', async (req, res) => {
    let cid = parseInt(req.params.cid);
    res.send(await cart.deleteCartById(cid));
})

export default cartsRouter;