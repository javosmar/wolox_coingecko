/**
 * Contiene las funciones para validar las criptomonedas guardadas
 */

let UserCripto = require('../models/usercripto');
const axios = require('axios');

let criptosList;

/**
 * Obtiene el listado de criptomonedas disponibles con sus datos desde la API de Coingecko
 */
async function getCriptos() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins');
        return response.data;
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
    this.criptosList = [];
    const criptos = await getCriptos();
    for (let i = 0; i < criptos.length; i++) {
        this.criptosList.push({
            symbol: criptos[i].symbol,
            current_price: criptos[i].market_data.current_price[moneda],
            name: criptos[i].name,
            image: criptos[i].image,
            last_updated: criptos[i].last_updated
        })
    }
    return res.json(this.criptosList);
};

/**
 * Agrega criptomonedas al usuario
 */
exports.addCripto = async (req, res) => {
    const { username } = req.user;
    const { criptomoneda } = req.body;
    const relacion = {username: username, criptomoneda: criptomoneda};
    const moneda = this.criptosList.find(elemento => elemento.symbol == relacion.criptomoneda);
    if(moneda){
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
                    if(err) {
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
    const { username } = req.user;
    console.log(username);
    
    return res.json([{ msg: 'aca va la cripto del user' }]);
}