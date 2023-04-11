// Importo dependencias
import {promises as fs} from 'fs';
import ProductManager from './ProductManager.js';

const productos = new ProductManager;

class CartManager {
    constructor() {
        this.path = './src/files/carts.json';
    }

    existCart = async (cid) => {
        let contenido = await this.readCarts();
        return contenido.find(cart => cart.id === cid);
    }

    readCarts = async () => {
        let contenido = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(contenido);
    }

    writeCarts = async (cart) => {
        await fs.writeFile(this.path, JSON.stringify(cart));
    }

    addCarts = async () => {
        let oldCarts = await this.readCarts();
        let id = Date.now();
        let allCarts = [{id: id, products: []}, ...oldCarts];
        await this.writeCarts(allCarts);
        return 'Carrito Agregado'
    }

    getCarts = async () => {
        return await this.readCarts();
    }

    getCartById = async (cid) => {
        let cartFilter = await this.existCart(cid);
        if(!cartFilter) return "ERROR! Carrito no encontrado";
        return cartFilter;
    }

    productInCart = async (cid, pid) => {
        // Primero chequeo que exista el carrito
        let cartById = await this.existCart(cid);
        if(!cartById) return "Carrito no encontrado!";
        
        // Si existe, entonces chequeo que exista el id del producto ingresado en la query
        let prodById = await productos.existProduct(pid);
        if(!prodById) return "Producto No encontrado";
        
        // Si existe el carrito y el producto, traigo el array de carritos
        let contenidoCarts = await this.readCarts();
        // y luego filtro ese array dejando de lado el carrito que deseo modificar
        let filter = contenidoCarts.filter(cart => cart.id != cid)
        
        // Utilizo el some para saber si ya existe el producto dentro del carrito. En caso afirmativo le sumo uno en cantidad.
        if(cartById.products.some(prod => prod.id === pid)){
            let sumarProd = cartById.products.find(prod => prod.id === pid);
            sumarProd.quantity++;
            let concat = [cartById, ...filter];
            await this.writeCarts(concat);
            return "Producto modificado en cantidad";
        } 
        // Si el producto no existe ya dentro del carrito, lo agrego por primera vez con cantidad igual a 1
        cartById.products.push({id: prodById.id, quantity: 1});

        let concat = [cartById,...filter];
        await this.writeCarts(concat);
        return "Agregaste un producto al carrito!";
    }  
    
    deleteCartById = async (id) => {
        let content = await this.readCarts();
        let exist = content.some(cart => cart.id === id)
        if(exist) {
            let cartFilter = content.filter(cart => cart.id != id);
            await this.writeCarts(cartFilter);
            return "Carrito Eliminado!";
        } else {
            return "Carrito Inexistente";
        } 
    }
}

export default CartManager;