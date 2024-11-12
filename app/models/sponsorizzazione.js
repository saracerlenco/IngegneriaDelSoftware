const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Sponsorizzazione', new Schema({
    id_evento: {
        type: Schema.Types.ObjectId, ref: 'Evento'
    },
    id_azienda: { 
        type: Schema.Types.ObjectId, ref: 'Azienda'
    }
}));