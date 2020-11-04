/**
 * Contiene las rutas protegidas
 */

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const https = require('https');

let promisesArray = [];

/**
 * Ruta que devuelve datos no protegidos
 */
router.get('/list-all', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const cryptos = ['01coin', 'arion', 'ark'];
    let cryptosInfo = [];

    let getCoins = (coin) => {
        return new Promise((resolve, reject) => {
            let req = https.get('https://api.coingecko.com/api/v3/coins/' + coin, (response) => {
                let data = '';
                response.on('data', (d) => {
                    data += d;
                });
                response.on('end', () => {
                    try {
                        let listDisponibles = JSON.parse(data);
                        resolve(listDisponibles);
                    }
                    catch (ex) {
                        reject(ex);
                    }
                });
            })
                .on('error', (error) => {
                    res.json({ msg: error });
                });

        });
    }

    for (let i = 0; i < cryptos.length; i++) {
        promisesArray.push(getCoins(cryptos[i]));
    }

    Promise.all(promisesArray).then((result) => {
        for(let i = 0; i < promisesArray.length; i++){
            const coin = {
                symbol: result[i].symbol,
                name: result[i].name,
                image: result[i].image.large,
            }
            cryptosInfo.push(coin);
        }
        console.log(cryptosInfo);
        res.json(cryptosInfo);
    });

    /* https.get('https://api.coingecko.com/api/v3/coins/list', (response) => {
        let data = '';
        response.on('data', (d) => {
            data += d;
        });
        response.on('end', () => {
            let listDisponibles = JSON.parse(data);
            const coinId = listDisponibles;
            console.log(coinId);
            res.json(listDisponibles);
        });
    })
    .on('error', (error) => {
        res.json({ msg: error });
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