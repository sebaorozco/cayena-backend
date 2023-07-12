import chai from "chai";
import mongoose from "mongoose";
import User from '../src/dao/mongoManagers/UserManagerDAO.js';
import config from "../src/config/index.js";

// Utilizaremos la variable expect desde ahora para hacer las comparaciones
const expect = chai.expect;
const URL = config.db.mongodbtest;

describe('** Pruebas al modulo de users dao utilizando Chai. **', () => {

    before(async function() {
      this.usersDao = User;
      await mongoose.connect(URL);;
    })
  
    beforeEach(async function() {
      await mongoose.connection.collections.users.drop();
    })
  
    after(async function() {
      await mongoose.connection.close();
    })
  
    afterEach(function() {
    })
  
    it('Esperamos que el resultado de llamado a la función get sea un array.', async function() {
      const users = await this.usersDao.getUsers();
      expect(users).to.be.deep.equal([]);
      expect(users).to.have.lengthOf(0);
      expect(Array.isArray(users)).to.be.equal(true);
      expect(Array.isArray(users)).to.be.ok;
    })
  
    it('Debe crear un usuario de forma exitosa.', async function() {
      const result = await this.usersDao.createUsers({
        first_name: 'Seba',
        last_name: 'Orozco',
        email: 'sebaorozco1979@gmail.com',
        password: 'qwerty'
      });
  
      expect(result).to.be.have.property('_id');
      expect(result).to.be.have.property('role');
      expect(Array.isArray(result.role)).to.be.ok;
      expect(result.role).to.be.deep.equal([]);
      expect(result).to.be.have.property('email', 'sebaorozco1979@gmail.com');
    })
  
    it('Debe obtener un usuario por email de forma exitosa.', async function() {
      await this.usersDao.createUsers({
        first_name: 'Seba',
        last_name: 'Orozco',
        email: 'sebaorozco1979@gmail.com',
        password: 'qwerty'
      });
  
      const user = await this.usersDao.getUserByEmail({email: 'sebaorozco1979@gmail.com'})
  
      expect(user).to.be.a('object');
      expect(user).to.be.have.property('_id');
    })
  
  })