import mongoose from 'mongoose';
import Product from '../../src/dao/mongoManagers/ProductManagerDAO.js';
import Assert from 'assert';
import config from '../../src/config/index.js';

const URL = config.db.mongodbtest;

const assert = Assert.strict;

let mockProduct = {
    title: 'Dulce de leche de coco',
    description: 'Dulce a base de leche de coco vegano',
    code: 'IJK456',
    price: 1100,
    stock: 95,
    category: 'Celíacos',
    thumbnails: '1688447776387dulce_leche_coco_vegan.jpg'
}

describe('[TEST] [UNIT] Products Dao.', () => {
    
    before(async function () {
        await mongoose.connect(URL);
    })
    
    beforeEach(async function () {
        mongoose.connection.collections.products.drop();
    })
    
    after(async function() {
        await mongoose.connection.close();
    })
    
    afterEach(function() {
    })
    
    describe('Pruebas al crear un producto', () => {
        it('Debe crear un producto de forma exitosa en la Base de Datos.', async function () {
            const result = await Product.createProduct(mockProduct);
            assert.ok(result._id);
            assert.strictEqual(typeof result.stock, 'number');
        })
        
        it('Debe agregar al producto registrado recientemente un campo owner que por defecto debe ser admin', async () => {
            const result = await Product.createProduct(mockProduct);
            assert.deepStrictEqual(result.owner, 'admin');
        })
    })

    describe('Pruebas al obtener un producto por el campo ID', () => {
        it('Debe obtener un producto por ID exitosamente', async function () {
            const result = await Product.createProduct(mockProduct);
            const prod = await Product.getProductById({ id: result._id });
            
            assert.strictEqual(typeof prod, 'object');
        })
        
        it('Debe fallar al intentar obtener un producto con un id que no existe', async () => {
            const result = await Product.createProduct(mockProduct);
            console.log('El resultado obtenido el producto creado es: ', result._id)
            const product = await Product.getProductById('idfalso');
            console.log('El producto es: ', product)
            assert.strictEqual(product, null);
        })
    }) 
        
})

    
