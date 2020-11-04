/**
 * Punto de ingreso de la API
 */

const express = require('express');
const passport = require('passport');
// const mongoose = require('mongoose');
// const config = require('./config/config');
const morgan = require('morgan');
// const { MONGO_USERNAME, MONGO_PASSWORD } = require('./config/keys');
const connection = require('./db/db');

// Settings
const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(morgan('dev'));
const passportMiddleware = require('./middlewares/passport');
passport.use(passportMiddleware);

// Routes
const routes = require('./routes/auth.routes.js');
app.use('/api', routes);

/* // Create the URL for connect to DB
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
}); */

// Starting the server
app.listen(port, () => {
    console.log(`API levantada en puerto ${port}`);
});