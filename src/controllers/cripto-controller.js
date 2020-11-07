/**
 * Contiene las funciones para validar las criptomonedas guardadas
 */

let UserCripto = require('../models/usercripto');
const axios = require('axios');

let criptosList = [];

/**
 * Ordena el array pasado por parámetro de manera ascendente o descendente, dependiendo del órden pasado
 * @param {1, -1} o 1: Orden ascendente | -1: Orden descendente
 * @param {*} arr Arreglo a ordenar
 * @return Array ordenado
 */
function ordenar(o, arr, moneda) {
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
 */
async function getCriptos(moneda) {
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
 * Devuelve el listado de todas las criptomonedas disponibles
 * @returns [{symbol, current_price, name, image, last_updated}]
 */
exports.listCripto = async (req, res) => {
    const moneda = req.user.moneda;
    await getCriptos(moneda);
    return res.json(criptosList);
};

/**
 * Agrega criptomonedas al usuario
 */
exports.addCripto = async (req, res) => {
    const { username } = req.user;
    const { criptomoneda } = req.body;
    const relacion = { username: username, criptomoneda: criptomoneda };
    const moneda = req.user.moneda;
    await getCriptos(moneda);
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

exports.listUserCripto = async (req, res) => {
    try {
        const { username, moneda } = req.user;
        const { orden } = req.query;
        const criptosUser = await UserCripto.find({ username: username });
        await getCriptos(moneda);
        let arr = [];
        await criptosUser.forEach(async (criptoUser) => {
            const el = await criptosList.find(elemento => elemento.symbol == criptoUser.criptomoneda);
            arr.push(el);
        });
        const ordenedArr = ordenar(orden, arr, moneda);
        return res.send(ordenedArr);
    } catch (error) {
        console.log(error);
    }
}