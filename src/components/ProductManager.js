// Importo dependencias
import {promises as fs} from 'fs';

class ProductManager {
    constructor() {
        this.path = './src/models/products.json';
    }

    readProducts = async () => {
        let contenido = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(contenido);
    }

    writeProducts = async (product) => {
        await fs.writeFile(this.path, JSON.stringify(product));
    }
    
    addProducts = async (product) => {
        let oldProducts = await this.readProducts();
        product.id = Date.now();
        let allProducts = [...oldProducts, product];
        await this.writeProducts(allProducts);
        return 'Producto Agregado'
    }

    getProducts = async () => {
        return await this.readProducts();
    }

    getProductById = async (id) => {
        let contenidoArray = await this.readProducts();
        let filter = await contenidoArray.find(product => product.id === id);
        if(filter){
            return filter; 
        } else {
            return "ERROR! Producto no encontrado";
        }
    }

    deleteProductById = async (id) => {
        let content = await this.readProducts();
        let exist = content.some(prod => prod.id === id)
        
        if(exist) {
            let productFilter = content.filter(prod => prod.id != id);
            await fs.writeFile(this.path, JSON.stringify(productFilter));
            return "Producto Eliminado!";
        } else {
            return "Producto Inexistente";
        } 
    }

    updateProductById = async (id, updateData) => {
        let content = await this.readProducts();
        let exist = content.some(prod => prod.id === id)
        if(exist) {
            await this.deleteProductById(id);
            let oldProducts = await this.readProducts();
            let prodModif = [{...updateData, id}, ...oldProducts];
            await this.writeProducts(prodModif);
            return "Producto Actualizado";
        }
    }
}

export default ProductManager;