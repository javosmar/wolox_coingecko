/**
 * Middleware para extraer el token de la cabecera http de las peticiones
 */

const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy,
     ExtractJwt  = require('passport-jwt').ExtractJwt;
const config = require('../config/config');

let options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}

module.exports = new JwtStrategy(options, function (jwt_payload, done) {
    User.findById(jwt_payload.id, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } 
        else {
            return done(null, false);
        }
    });
});