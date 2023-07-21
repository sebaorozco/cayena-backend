import mongoose from 'mongoose';
import Cart from '../../src/dao/mongoManagers/CartManagerDAO.js';
import Assert from 'assert';
import config from '../../src/config/index.js';

const URL = config.db.mongodbtest;

const assert = Assert.strict;

let mockCart = {
    products: [ ]
}

describe('[TEST] [UNIT] Carts Dao.', () => {
    
    before(async function () {
        await mongoose.connect(URL);
    })
    
    beforeEach(async function () {
        mongoose.connection.collections.carts.drop();
    })
    
    after(async function() {
        await mongoose.connection.close();
    })
    
    afterEach(function() {
    })
    
    describe('Pruebas al obtener un carrito por el campo ID', () => {
        it('Debe obtener un carrito por ID exitosamente', async function () {
            const result = await Cart.createCart(mockCart);
            console.log('el resultado del carrito creado es: ', result)
            const cart = await Cart.getCartById(result._id);
            
            assert.strictEqual(typeof cart, 'object');
        })
        
        it('Debe fallar al intentar obtener un carrito con un id que no existe', async () => {
            const result = await Cart.createCart(mockCart);
            const cart = await Cart.getCartById('idfalso');

            assert.strictEqual(typeof cart, 'object');
            assert.strictEqual(cart, null);
        })
    }) 
        
})

    
