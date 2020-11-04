/**
 * Contiene la estructura de los datos 'user', el middleware para encriptar y comparar
 * los datos entrantes con los datos encriptados
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    moneda: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

/**
 * Hashea el password antes de almacenarlo en la DB
 */
UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

/**
 * Compara el password recibido con el hash almacenado en la DB
 */
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

module.exports = mongoose.model('User', UserSchema);