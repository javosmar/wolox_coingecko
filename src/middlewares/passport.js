/**
 * Middleware para extraer el token de la cabecera http de las peticiones
 */

let User = require('../models/user');
let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt  = require('passport-jwt').ExtractJwt;
let config = require('../config/config');

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}

module.exports = new JwtStrategy(opts, function (jwt_payload, done) {
    console.log(jwt_payload);
    User.findById(jwt_payload.id, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
});