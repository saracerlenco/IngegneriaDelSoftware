const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Operatore_Comunale', new Schema({
    nome: String,
    cognome: String,
    email: String,
    codice_fiscale: String,
    password: String
}));