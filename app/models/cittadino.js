const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Cittadino', new Schema({
    nome: String,
    cognome: String,
    email: String,
    codice_fiscale: String,
    username: String,
    password: String,
    punti: {
        type: Number,
        default: "0"
    }
}));