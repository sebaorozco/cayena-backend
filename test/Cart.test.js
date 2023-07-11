import mongoose from 'mongoose';
import Cart from '../src/dao/mongoManagers/CartManagerDAO.js';
import Assert from 'assert';
import config from '../src/config/index.js';

const URL = config.db.mongodbtest;

const assert = Assert.strict;

describe('**** Testing Carts Dao. ****', () => {
    
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
        it('Debe obtener un producto por ID exitosamente', async function () {
            let mockCart = {
                products: {
                    product_id: 'poiuytrewqasdfghjk987564',
                    quantity: 3
                }
            }
            const result = await Cart.createCart(mockCart);
            const cart = await Cart.getCartById({ id: result._id });
            
            assert.strictEqual(typeof cart, 'object');
        })
        
        it('Debe fallar al intentar obtener un carrito con un id que no existe', async () => {
            let mockCart = {
                products: {
                    product_id: 'poiuytrewqasdfghjk987564',
                    quantity: 3
                }
            }
            const result = await Cart.createCart(mockCart);
            const cart = await Cart.getCartById({ id: result._id });

            assert.strictEqual(typeof cart, 'object');
            assert.strictEqual(cart, true);
        })
    }) 
        
})

    
