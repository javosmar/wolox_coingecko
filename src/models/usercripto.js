/**
 * Contiene el esquema de las relaciones usuario - criptopomenda
 */

var mongoose = require('mongoose');

var UserCriptoSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    criptomoneda: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('UserCripto', UserCriptoSchema);