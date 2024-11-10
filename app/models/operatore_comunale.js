const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Operatore_Comunale', new Schema({
    nome: String,
    cognome: String,
    email: String,
    codice_fiscale: String,
    password: String,
    ruolo: {
        type: String,
        enum: ['cittadino', 'azienda', 'operatore_comunale'],
        default: 'operatore_comunale'
    }
}));