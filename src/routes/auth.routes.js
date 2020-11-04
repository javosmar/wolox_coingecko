/**
 * Contiene las rutas básicas de la API
 */

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const authController = require('../controllers/auth-controller');

/**
 * Rutas para el registro e ingreso de usuarios
 */
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

/**
 * Ruta que devuelve datos no protegidos
 */
router.get('/public', (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Public one',
            description: 'Lorem impsum',
            date: "2020-11-15T20:30:32.211Z"
        },
        {
            _id: 2,
            name: 'Public two',
            description: 'Lorem impsum',
            date: "2020-11-15T20:30:32.211Z"
        },
        {
            _id: 3,
            name: 'Public tree',
            description: 'Lorem impsum',
            date: "2020-11-15T20:30:32.211Z"
        }
    ]);
});

/**
 * Ruta que devuelve datos protegidos
 */
router.get('/private', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Private one',
            description: 'Lorem impsum',
            date: "2020-11-15T20:30:32.211Z"
        },
        {
            _id: 2,
            name: 'Private two',
            description: 'Lorem impsum',
            date: "2020-11-15T20:30:32.211Z"
        },
        {
            _id: 3,
            name: 'Private tree',
            description: 'Lorem impsum',
            date: "2020-11-15T20:30:32.211Z"
        }
    ]);
});

module.exports = router;