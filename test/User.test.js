import mongoose from 'mongoose';
import Assert from 'assert';
import { after, before, beforeEach } from 'mocha';
import config from '../src/config/index.js';
import UserManagerDAO from '../src/dao/mongoManagers/UserManagerDAO.js';

const URL = config.db.mongodbtest;

const assert = Assert.strict;

describe('Testing Users Dao.', () => {
    before(async function () {
        await mongoose.connect(URL);
    })
    
    beforeEach(async function () {
        mongoose.connection.collections.users.drop();
        this.timeout(5000);
    })
    
    after(async function() {
        await mongoose.connection.close();
    })
    
    afterEach(function() {
    })
    
    it('Debe crear un usuario de forma exitosa en la Base de Datos.', async function () {
        let mockUser = {
          first_name: 'Seba',
          last_name: 'Orozco',
          email: 'sebaorozco1979@gmail.com',
          password: 'qwerty',
        };
        const result = await UserManagerDAO.createUser(mockUser);
        console.log('Result: ', result._id)
        assert.ok(result._id);
        assert.strictEqual(Array.isArray(result.email), true);
        assert.strictEqual(result.email, 'sebaorozco1979@gmail.com');
    })
    
    /* it('Debe fallar al intentar crear un usuario porque falta el campo email', async () => {

    }) */
    describe('Pruebas al obtener un usuario por el campo email', () => {
        it('Debe obtener un usuario por email exitosamente', async function () {
            let mockUser = {
                first_name: 'Seba',
                last_name: 'Orozco',
                email: 'sebaorozco1979@gmail.com',
                password: 'qwerty',
            }
            const result = await UserManagerDAO.createUser(mockUser);
    
            const user = await UserManagerDAO.getUserByEmail({ email: result.email });
            assert.strictEqual(typeof user, 'object');
        })
        
    /*    it('Debe fallar al intentar obtener un usuario con un email que no existe', async () => {
        
        })*/
    }) 
        
})

    
