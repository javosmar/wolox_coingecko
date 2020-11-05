/**
 * Contiene las rutas protegidas
 */

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const axios = require('axios');

/**
 * Obtiene el listado de criptomonedas con sus datos desde la API de Coingecko
 */
async function getCryptos() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins');
        return response.data;
    }
    catch (error) {
        console.log(error);
    }
}

/**
 * Ruta que devuelve el listado de todas las criptomonedas disponibles
 * @returns [{symbol, current_price, name, image, last_updated}]
 */
router.get('/list-all', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const moneda = 'ars';
    let cryptosList = [];
    const cryptos = await getCryptos();
    for(let i = 0; i < cryptos.length; i++){
        cryptosList.push({
            symbol: cryptos[i].symbol,
            current_price: cryptos[i].market_data.current_price[moneda],
            name: cryptos[i].name,
            image: cryptos[i].image,
            last_updated: cryptos[i].last_updated
        })
    }
    res.json(cryptosList);
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