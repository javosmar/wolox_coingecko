/**
 * Contiene las rutas básicas de la API
 */

const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth-controller');

/**
 * Rutas para el registro e ingreso de usuarios
 */
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;