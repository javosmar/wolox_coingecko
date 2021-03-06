/**
 * Contiene las funciones para validar las criptomonedas guardadas
 */

let UserCripto = require('../models/usercripto');
const axios = require('axios');

let criptosList = [];
const limiteCriptos = 25;

/**
 * Devuelve el array pasado por parámetro ordenado de manera ascendente o descendente, dependiendo del órden pasado
 * Por defecto el orden es descendente
 * @param {1, -1} o 1: Orden ascendente | -1: Orden descendente
 * @param {*} arr Arreglo a ordenar
 * @return Array ordenado
 */
function ordenar(arr, moneda, o = -1) {
    if (o > 0) {
        arr.sort((a, b) => {
            if (a.current_price[moneda] > b.current_price[moneda])
                return 1;
            if (a.current_price[moneda] < b.current_price[moneda])
                return -1;
            return 0;
        });
    }
    else {
        arr.sort((a, b) => {
            if (a.current_price[moneda] > b.current_price[moneda])
                return -1;
            if (a.current_price[moneda] < b.current_price[moneda])
                return 1;
            return 0;
        });
    }
    return arr;
}

/**
 * Obtiene el listado de criptomonedas disponibles con sus datos desde la API de Coingecko
 * y lo almacena en el array 'criptosList'
 */
async function getCriptos() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins');
        criptosList = [];
        const criptos = response.data;
        for (let i = 0; i < criptos.length; i++) {
            criptosList.push({
                symbol: criptos[i].symbol,
                current_price: {
                    ars: criptos[i].market_data.current_price.ars,
                    eur: criptos[i].market_data.current_price.eur,
                    usd: criptos[i].market_data.current_price.usd,
                },
                name: criptos[i].name,
                image: criptos[i].image,
                last_updated: criptos[i].last_updated
            });
        }
    }
    catch (error) {
        console.log(error);
    }
}

/**
 * Devuelve el listado de todas las criptomonedas disponibles cotizadas en la moneda preferida del usuario
 * @returns [{symbol, current_price, name, image, last_updated}]
 */
exports.listCripto = async (req, res) => {
    const moneda = req.user.moneda;
    await getCriptos();
    criptosList.forEach((elemento) => {
        const cotizacion = elemento.current_price[moneda];
        elemento.current_price = cotizacion;
    });
    return res.json(criptosList);
};

/**
 * Agrega criptomonedas al usuario. En caso de que la relación exista, no la añade
 */
exports.addCripto = async (req, res) => {
    const { username } = req.user;
    const { criptomoneda } = req.body;
    const relacion = { username: username, criptomoneda: criptomoneda };
    await getCriptos();
    const criptoExists = criptosList.find(elemento => elemento.symbol == relacion.criptomoneda);
    if (criptoExists) {
        await UserCripto.findOne({ username: username, criptomoneda: criptomoneda }, (err, cripto) => {
            if (err) {
                return res.status(500).json({ 'msg': err });
            }
            if (cripto) {
                return res.status(400).json({ 'msg': 'El usuario ya posee posee la criptomoneda' });
            }
            else {
                const newCripto = UserCripto({ username, criptomoneda });
                newCripto.save((err, cripto) => {
                    if (err) {
                        return res.status(500).json({ 'msg': err });
                    }
                    return res.status(200).json({ 'msg': 'Criptomoneda añadida con éxito' });
                });
            }
        });
    }
    else {
        return res.status(400).json({ 'msg': 'No existe la criptomoneda' });
    }
};

/**
 * Devuelve el listado de criptomonedas añadidas por el usuario
 */
exports.listUserCripto = async (req, res) => {
    try {
        const { username, moneda } = req.user;
        const { orden } = req.query;
        const criptosUser = await UserCripto.find({ username: username });
        await getCriptos();
        let arr = [];
        await criptosUser.forEach(async (criptoUser) => {
            const el = await criptosList.find(elemento => elemento.symbol == criptoUser.criptomoneda);
            arr.push(el);
        });
        let ordenedArr = ordenar(arr, moneda, orden);
        if(ordenedArr.length > limiteCriptos){
            ordenedArr = ordenedArr.slice(0,limiteCriptos);
        }
        return res.send(ordenedArr);
    } catch (error) {
        console.log(error);
    }
}