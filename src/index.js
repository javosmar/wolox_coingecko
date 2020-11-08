/**
 * Punto de ingreso de la API
 */

const express = require('express');
const passport = require('passport');
const passportMiddleware = require('./middlewares/passport');
const connection = require('./db/db');

const morgan = require('morgan');

// Settings
const app = express();
const port = process.env.PORT || 8000;

// Middlewares
passport.use(passportMiddleware);
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan('dev'));

// Routes
const authRoutes = require('./routes/auth.routes');
const coinsRoutes = require('./routes/coins.routes');
app.use('/api', authRoutes);
app.use('/api/coins', coinsRoutes);

// Starting the server
app.listen(port, () => {
    console.log(`API levantada en puerto ${port}`);
});