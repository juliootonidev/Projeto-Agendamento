const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.pagarme.me/1',
});

const api_key = require('../data/key.json').api_key;

module.exports = async (endpoint, data) =>{
    try{
        const reponse = await api.post(endpoint, {
            api_key,
            ...data,
        });

        return { error: false, data: reponse.data };
    }catch (err) {
        return{
            error: true,
            message: JSON.stringify(err.reponse.data.console.errors[0]),
        };
    }
}