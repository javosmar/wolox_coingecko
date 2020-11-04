/**
 * Contiene las rutas protegidas
 */

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const https = require('https');
const axios = require('axios');

let promisesArray = [];

async function getCryptos() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

async function getInfo(id) {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/' + id);
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

/**
 * Ruta que devuelve datos no protegidos
 */
router.get('/list-all', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // const cryptos = ['01coin', 'arion', 'ark'];
    let cryptosInfo = [];

    const cryptos = await getCryptos();
    console.log(cryptos[0].id)
    res.json(cryptos);
    /* for (let i = 0; i < cryptos.length; i++) {
        cryptosInfo.push(await getInfo(cryptos[i].id));
    }
    res.json(cryptosInfo) */;

    /* Promise.all([getCryptos(), getInfo('01coin')])
    .then(function(results) {
        const cryptosArray = results[0].data;
        const infoArray = results[1].data;
        console.log(cryptosArray);
        res.json(infoArray);
    }); */

    
});

/**
 * Ruta que devuelve datos protegidos
 */
router.get('/private', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json([
        {
            _id: 1,
            name: 'Private one',
            description: 'Lorem impsum',
            date: "2020-11-15T20:30:32.211Z"
        },
        {
            _id: 2,
            name: 'Private two',
            description: 'Lorem impsum',
            date: "2020-11-15T20:30:32.211Z"
        },
        {
            _id: 3,
            name: 'Private tree',
            description: 'Lorem impsum',
            date: "2020-11-15T20:30:32.211Z"
        }
    ]);
});

module.exports = router;