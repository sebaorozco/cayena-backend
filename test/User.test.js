import mongoose from 'mongoose';
import User from '../src/dao/mongoManagers/UserManagerDAO.js';
import Assert from 'assert';
import config from '../src/config/index.js';

const URL = config.db.mongodbtest;

const assert = Assert.strict;

describe('**** Testing Users Dao. ****', () => {
    
    before(async function () {
        await mongoose.connect(URL);
    })
    
    beforeEach(async function () {
        mongoose.connection.collections.users.drop();
        //this.timeout(5000);
    })
    
    after(async function() {
        await mongoose.connection.close();
    })
    
    afterEach(function() {
    })
    
    describe('Pruebas al crear un usuario', () => {
        it('Debe crear un usuario de forma exitosa en la Base de Datos.', async function () {
            const result = await User.createUser({
                first_name: 'Seba',
                last_name: 'Orozco',
                email: 'sebaorozco1979@gmail.com',
                password: 'qwerty'
            });
            assert.ok(result._id);
            assert.strictEqual(result.email, 'sebaorozco1979@gmail.com');
        })
        
        it('Debe agregar al usuario registrado recientemente un rol que por defecto debe ser user', async () => {
            const result = await User.createUser({
                first_name: 'Seba',
                last_name: 'Orozco',
                email: 'sebaorozco1979@gmail.com',
                password: 'qwerty'
            });
            assert.deepStrictEqual(result.role, 'user');
        })
    })

    describe('Pruebas al obtener un usuario por el campo email', () => {
        it('Debe obtener un usuario por email exitosamente', async function () {
            let mockUser = {
                first_name: 'Seba',
                last_name: 'Orozco',
                email: 'sebaorozco1979@gmail.com',
                password: 'qwerty',
            }
            const result = await User.createUser(mockUser);
            const user = await User.getUserByEmail({ email: result.email });
            
            assert.strictEqual(typeof user, 'object');
            assert.strictEqual(result.email, user.email);
        })
        
        it('Debe fallar al intentar obtener un usuario con un email que no existe', async () => {
            const result = await User.createUser({
                first_name: 'Seba',
                last_name: 'Orozco',
                password: 'password'
            });
            const user = await User.getUserByEmail({ email: result.email });

            assert.strictEqual(typeof user, 'object');
            assert.strictEqual(user, true);
        })
    }) 
        
})

    
