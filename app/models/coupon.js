const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Coupon', new Schema({
    id_azienda: {
        type: Schema.Types.ObjectId, ref: 'Azienda'
    },
    descrizione_coupon: String,
    punti: {
        type: Number,
        default: "0"
    }
}));