const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Sponsorizzazione', new Schema({
    id_evento: {
        type: String,
        ref: 'Evento'
    },
    _id: {
        type: String,
        ref: 'Azienda'
    }
}));