import chai from "chai";
import supertest from "supertest";
import config from "../../src/config/index.js";

const PORT = config.port;

const expect = chai.expect;
const requester = supertest(`http://localhost:${PORT}`);

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

describe('**** Testing Cayena - Functional TEST. Supertest ****', () => {
    
    describe('Test de Usuarios', () => {
        it('El endpoint POST /api/users/register debe registrar un usuario correctamente', async function () {
            const userData = {
                first_name: 'Don',
                last_name: 'Supertest',
                email: `testUser${today}@gmail.com`,
                age: 30,
                password: 'qwerty',
                role: 'admin'
            }

            const {
                statusCode,
                ok,
                _body 
            } = await requester.post('/api/users/register').send(userData);
            // Preguntamos si el payload tiene un _id, en caso de tenerlo significa que fue registrado correctamente
            //expect(_body.payload).to.have.property('_id');    
            console.log('_body: ', _body.payload)
            expect(statusCode).to.equal(201);
            expect(ok).to.equal(true)
        })
    })
})