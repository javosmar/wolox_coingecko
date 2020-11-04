/**
 * Contiene la conexión a MongoDB
 */

const mongoose = require('mongoose');
const config = require('../config/config');
const { MONGO_USERNAME, MONGO_PASSWORD } = require('../config/keys');

// Opciones para la conexión a la DB
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    "auth": {
        "authSource": "admin"
    },
    "user": MONGO_USERNAME,
    "pass": MONGO_PASSWORD
};

// Conexión a MongoDB
mongoose.connect(config.db, options);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Conexión a MongoDB establecida');
});
connection.on('error', (err) => {
    console.log('Error de conexión a MongoDB.' + err);
    process.exit();
});

module.exports = connection;