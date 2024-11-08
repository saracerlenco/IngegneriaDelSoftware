const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Coupon', new Schema({
    nome_azienda: {
        type: Schema.Types.nome_azienda, ref: 'Azienda'
    },
    descrizione_coupon: String,
    sconto_offerto: {
        type: Number,
        default: 0
    }
}));