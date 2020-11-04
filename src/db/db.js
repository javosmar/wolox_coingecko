/**
 * Contiene la conexión a mongodb
 */

const mongoose = require('mongoose');
const config = require('../config/config');
const { MONGO_USERNAME, MONGO_PASSWORD } = require('../config/keys');

// Create the URL for connect to DB
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

// DB Connection
mongoose.connect(config.db, options);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established succesfully!');
});
connection.on('error', (err) => {
    console.log('MongoDB connection error.' + err);
    process.exit();
});

module.exports = connection;