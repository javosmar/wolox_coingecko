/**
 * Contiene las funciones para autenticación de usuarios (register - login)
 */

let User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Crea el token conteniendo el id, el username y el expiresin
 * @param {nombre, apellido, username, password, moneda} user Objeto usuario 
 */
function createToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, {
        expiresIn: config.expires_in
    });
}

/**
 * Realiza el registro de un usuario nuevo, verificando que no existan campos vacíos
 * y que el username no exista previamente en la DB.
 * Responde con el token creado para la sesión.
 */
exports.registerUser = (req, res) => {
    console.log(req.body);
    if (!req.body.nombre || !req.body.apellido || !req.body.username || !req.body.password || !req.body.moneda) {
        return res.status(400).json({ 'msg': 'datos insuficientes para el registro' });
    }

    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
        if (user) {
            return res.status(400).json({ 'msg': 'The username already exists' });
        }
        else {
            const newUser = User(req.body);
            newUser.save((err, user) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ 'msg': err });
                }
                return res.status(200).json({
                    token: createToken(user)
                });
            });
        }
    });

    
};

/**
 * Loguea un usuario, verificando que no existan campos vacíos, que el username exista previamente en la DB
 * y que el password recibido concuerde con el almacenado.
 * Responde con el token creado para la sesión.
 */
exports.loginUser = (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ 'msg': 'You need to send username and password' });
    }

    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
        if (!user) {
            return res.status(400).json({ 'msg': 'The username does not exists' });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(user)
                });
            }
            else {
                return res.status(400).json({ 'msg': 'The username and password dont match' });
            }
        });
    });
};