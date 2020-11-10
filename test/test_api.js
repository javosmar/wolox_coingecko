/**
 * Contiene las pruebas unitarias de la API
 */

/**
 * +++++++++++++++++++++++++++++++++++++++++
 * +++++++++++++++ Backlog ++++++++++++++++++++
 * +++++++++++++++++++++++++++++++++++++++++
 * 
 * v No debo poder crear un usuario sin nombre, apellido, username, contraseña o moneda preferida
 * v No debo poder crear un usuario con username existente
 * v No debo poder crear un usuario con password de longitud menor a 8 caracteres
 * v No debo poder crear un usuario con password que no sea alfanumérico
 * v Debo poder crear un usuario con nombre, apellido, username, contraseña y moneda preferida
 * 
 * v No debo obtener el token al pasar un usuario no existente
 * v No debo obtener el token al pasar una contraseña incorrecta
 * v Debo obtener el token mediante un endpoint de login pasando un usuario existente y una contraseña válida
 * v El token debe tener un tiempo de expiración
 * 
 * v No debo poder obtener el listado de criptomonedas disponibles sin un token
 * v No debo poder agregar criptomonedas sin un token
 * 
 * v Un usuario debe poder obtener el listado de criptomonedas disponibles
 * v Un usuario debe poder obtener el listado de criptomonedas disponibles cotizadas solamente en su moneda preferida
 * v Un usuario debe poder agregarse criptomonedas
 * v Un usuario debe poder obtener sus criptomonedas
 * v Un usuario debe poder obtener sus criptomonedas ordenadas ascendentemente en moneda preferida
 * v Un usuario debe poder obtener sus criptomonedas ordenadas descendentemente en moneda preferida
 * v Un usuario debe poder obtener sus criptomonedas con cotizacion en US$, € y AR$
 * v Un usuario debe poder obtener hasta sus primeras 25 criptomonedas
 * 
 * v Un usuario no debe poder agregarse criptomonedas no disponibles
 * v Un usuario no debe poder agregarse criptomonedas que posea
 */

let chai = require('chai');
let chaiHttp = require('chai-http');
const chaiJwt = require('chai-jwt');
const expect = require('chai').expect;

chai.use(chaiHttp);
chai.use(chaiJwt);

const url = 'http://localhost:8000/api';
const userIncompleto = { nombre: "Test", apellido: "1", username: "testNuevo2", password: "holitas123" };
const userPassCorto = { nombre: "Test", apellido: "1", username: "testLong", password: "hola123", moneda: "ars" };
const userPassAlfa = { nombre: "Test", apellido: "1", username: "testLong", password: "holitas@123", moneda: "ars" };
const userNuevo = { nombre: "Test", apellido: "1", username: "testNuevo" + Math.floor(Math.random() * 100), password: "holitas123", moneda: "usd" };
const userExistente = { nombre: "Test", apellido: "1", username: "testNuevo2", password: "holitas123", moneda: "ars" };
const newCripto = { criptomoneda: 'link' };
let tokenNuevo = '';
let tokenExistente = '';

describe('No debo poder crear un usuario ', () => {
    it('sin nombre, apellido, username, contraseña o moneda preferida', (done) => {
        chai.request(url)
            .post('/register')
            .send(userIncompleto)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('con password de longitud menor a 8 caracteres', (done) => {
        chai.request(url)
            .post('/register')
            .send(userPassCorto)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('con password que no sea alfanumérico', (done) => {
        chai.request(url)
            .post('/register')
            .send(userPassAlfa)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('con username existente', (done) => {
        chai.request(url)
            .post('/register')
            .send(userExistente)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });
});

describe('Debo poder crear un usuario ', () => {
    it('con nombre, apellido, username, contraseña y moneda preferida', (done) => {
        chai.request(url)
            .post('/register')
            .send(userNuevo)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });
});

describe('Debo obtener el token mediante un endpoint de login ', () => {
    it('pasando un usuario existente y una contraseña válida', (done) => {
        chai.request(url)
            .post('/login')
            .send({ username: userNuevo.username, password: userNuevo.password })
            .end((err, res) => {
                tokenNuevo = res.body.token;
                expect(res).to.have.status(200);
                expect(tokenNuevo).to.be.a.jwt;
                done();
            });
    });
});

describe('No debo obtener el token ', () => {
    it('al pasar un usuario no existente', (done) => {
        chai.request(url)
            .post('/login')
            .send({ username: "usuario", password: userNuevo.password })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('al pasar una contraseña incorrecta', (done) => {
        chai.request(url)
            .post('/login')
            .send({ username: userNuevo.username, password: "hola" })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });
});

describe('El token debe ', () => {
    it('tener un tiempo de expiración', (done) => {
        chai.request(url)
            .post('/login')
            .send({ username: userExistente.username, password: userExistente.password })
            .end((err, res) => {
                tokenExistente = res.body.token;
                expect(res).to.have.status(200);
                // Decodifico el token para analizarlo
                const encodedValue = tokenExistente.split('.')[1];
                const decodedValue = JSON.parse(Buffer.from(encodedValue, 'base64').toString());
                expect(decodedValue).to.has.property('exp');
                done();
            });
    });
});

describe('No debo poder ', () => {
    it('obtener el listado de criptomonedas disponibles sin un token', (done) => {
        chai.request(url)
            .get('/coins/list-all')
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('agregar criptomonedas sin un token', (done) => {
        chai.request(url)
            .post('/coins/add')
            .send({ criptomoneda: 'btc' })
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });
});

describe('Un usuario debe poder ', () => {
    it('obtener el listado de criptomonedas disponibles', (done) => {
        chai.request(url)
            .get('/coins/list-all')
            .set({ 'Authorization': `Bearer ${tokenNuevo}` })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const criptomoneda = res.body[0];
                expect(criptomoneda).to.have.property('symbol');
                expect(criptomoneda).to.have.property('current_price');
                expect(criptomoneda).to.have.property('name');
                expect(criptomoneda).to.have.property('image');
                expect(criptomoneda).to.have.property('last_updated');
                done();
            });
    });

    it('obtener el listado de criptomonedas disponibles cotizadas solamente en su moneda preferida', (done) => {
        chai.request(url)
            .get('/coins/list-all')
            .set({ 'Authorization': `Bearer ${tokenNuevo}` })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const criptomoneda = res.body[0];
                expect(criptomoneda).to.have.property('current_price');
                expect(criptomoneda).to.have.property('current_price').to.not.have.property('usd');
                expect(criptomoneda).to.have.property('current_price').to.not.have.property('eur');
                done();
            });
    });

    it('agregarse criptomonedas', (done) => {
        chai.request(url)
            .post('/coins/add')
            .set({ 'Authorization': `Bearer ${tokenNuevo}` })
            .send(newCripto)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('obtener sus criptomonedas', (done) => {
        chai.request(url)
            .get('/coins/list-user')
            .set({ 'Authorization': `Bearer ${tokenExistente}` })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const criptomoneda = res.body[0];
                expect(criptomoneda).to.have.property('symbol');
                expect(criptomoneda).to.have.property('current_price');
                expect(criptomoneda).to.have.property('name');
                expect(criptomoneda).to.have.property('image');
                expect(criptomoneda).to.have.property('last_updated');
                done();
            });
    });

    it('obtener sus criptomonedas ordenadas ascendentemente en moneda preferida', (done) => {
        chai.request(url)
            .get('/coins/list-user?orden=1')
            .set({ 'Authorization': `Bearer ${tokenExistente}` })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const list = res.body;
                let ordenado = true;
                for (let i = 0; i < list.length - 1; i++) {
                    if (list[i].current_price > list[i + 1].current_price) {
                        ordenado = false;
                        break;
                    }
                }
                expect(ordenado).to.be.equal(true);
                done();
            });
    });

    it('obtener sus criptomonedas ordenadas descendentemente en moneda preferida', (done) => {
        chai.request(url)
            .get('/coins/list-user')
            .set({ 'Authorization': `Bearer ${tokenExistente}` })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const list = res.body;
                let ordenado = true;
                for (let i = 0; i < list.length - 1; i++) {
                    if (list[i].current_price < list[i + 1].current_price) {
                        ordenado = false;
                        break;
                    }
                }
                expect(ordenado).to.be.equal(true);
                done();
            });
    });

    it('obtener sus criptomonedas con cotizacion en US$, € y AR$', (done) => {
        chai.request(url)
            .get('/coins/list-user?orden=-1')
            .set({ 'Authorization': `Bearer ${tokenExistente}` })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const criptomoneda = res.body[0];
                expect(criptomoneda).to.have.property('current_price').to.have.property('ars');
                expect(criptomoneda).to.have.property('current_price').to.have.property('usd');
                expect(criptomoneda).to.have.property('current_price').to.have.property('eur');
                done();
            });
    });

    it('obtener hasta sus primeras 25 criptomonedas', (done) => {
        chai.request(url)
            .get('/coins/list-user?orden=-1')
            .set({ 'Authorization': `Bearer ${tokenExistente}` })
            .end((err, res) => {
                expect(res).to.have.status(200);
                const list = res.body;
                expect(list).to.have.lengthOf.at.most(25);
                done();
            });
    });
});

describe('Un usuario no debe poder ', () => {
    it('agregarse criptomonedas no disponibles', (done) => {
        chai.request(url)
            .post('/coins/add')
            .set({ 'Authorization': `Bearer ${tokenExistente}` })
            .send({ criptomoneda: 'moneda' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('agregarse criptomonedas que posee', (done) => {
        chai.request(url)
            .post('/coins/add')
            .set({ 'Authorization': `Bearer ${tokenExistente}` })
            .send(newCripto)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });
});