const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Coupon_Cittadino', new Schema({
    id_coupon: {
        type: Schema.Types.ObjectId, ref: 'Coupon'
    },
    id_cittadino: { 
        type: Schema.Types.ObjectId, ref: 'Cittadino'
    }
}));