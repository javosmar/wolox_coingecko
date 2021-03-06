/**
 * Contiene las funciones para autenticación de usuarios (register - login)
 */

let User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');


/**
 * Valida la conformación de la contraseña (longitud > 7 y sólo caracteres alfanuméricos)
 * @param pass String 
 */
function validarPassword(pass) {
    // Prueba la contraseña contra la expresión regular en busca de caracteres que no sean alfanuméricos
    var caracteres = /^[a-z0-9]+$/i;
    var alfanum = caracteres.test(pass);
    const longitud = pass.length > 7 ? true : false;
    if (alfanum && longitud) {
        return true;
    }
    return false;
}

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
 * Realiza el registro de un usuario nuevo, verificando que no existan campos vacíos, que la moneda sea válida y
 * que el username no exista previamente en la DB.
 * Responde con el token creado para la sesión.
 */
exports.registerUser = async (req, res) => {
    const { nombre, apellido, username, password, moneda } = req.body;
    const monedasAdmitidas = ['usd', 'ars', 'eur'];
    if (!nombre || !apellido || !username || !password || !moneda) {
        return res.status(400).json({ 'msg': 'Datos insuficientes para el registro' });
    }
    else if (!validarPassword(password)) {
        return res.status(400).json({ 'msg': 'La contraseña debe contener la menos 8 caracteres alfanuméricos' });
    }
    else if (!monedasAdmitidas.includes(moneda)) {
        return res.status(400).json({ 'msg': 'Moneda no admitida' });
    }
    else {
        await User.findOne({ username: username }, async (err, user) => {
            if (err) {
                return res.status(500).json({ 'msg': err });
            }
            if (user) {
                return res.status(400).json({ 'msg': 'El usuario ya existe' });
            }
            else {
                const newUser = User(req.body);
                await newUser.save((err, user) => {
                    if (err) {
                        return res.status(500).json({ 'msg': err });
                    }
                    return res.status(200).json({ 'msg': 'Usuario creado con éxito' });
                });
            }
        });
    }
};

/**
 * Loguea un usuario, verificando que no existan campos vacíos, que el username exista previamente en la DB
 * y que el password recibido concuerde con el almacenado.
 * Responde con el token creado para la sesión.
 */
exports.loginUser = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ 'msg': 'Datos insuficientes' });
    }
    await User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            return res.status(500).json({ 'msg': err });
        }
        if (!user) {
            return res.status(400).json({ 'msg': 'Usuario o contraseña incorrectos' });
        }
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(user)
                });
            }
            else {
                return res.status(400).json({ 'msg': 'Usuario o contraseña incorrectos' });
            }
        });
    });
};