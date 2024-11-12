const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Partecipazione', new Schema({
    id_evento: {
        type: Schema.Types.ObjectId, ref: 'Evento'
    },
    id_cittadino: { 
        type: Schema.Types.ObjectId, ref: 'Cittadino'
    }
}));
