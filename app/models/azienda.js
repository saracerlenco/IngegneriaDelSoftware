const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Azienda', new Schema({
    nome_azienda: String,
    partita_IVA: String,
    email: String,
    password: String
}));