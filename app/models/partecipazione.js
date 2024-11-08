const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Partecipazione', new Schema({
    id_evento: {
        type: String,
        ref: 'Evento'
    },
    _id: {
        type: String,
        ref: 'Cittadino'
    }
}));
