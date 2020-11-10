/**
 * Contiene las rutas protegidas
 */

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const userCripto = require('../controllers/cripto-controller');

/**
 * Ruta que devuelve el listado de todas las criptomonedas disponibles
 * @returns [{symbol, current_price, name, image, last_updated}]
 */
router.get('/list-all', passport.authenticate('jwt', { session: false }), userCripto.listCripto);

/**
 * Ruta para que un usuario se agregue criptomonedas
 */
router.post('/add', passport.authenticate('jwt', { session: false }), userCripto.addCripto);

/**
 * Ruta para que un usuario enliste sus criptomonedas agregadas
 */
router.get('/list-user', passport.authenticate('jwt', { session: false }), userCripto.listUserCripto);

module.exports = router;