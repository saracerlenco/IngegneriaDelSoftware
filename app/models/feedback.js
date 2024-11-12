const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Feedback', new Schema({
    id_evento: {
        type: Schema.Types.ObjectId, ref: 'Evento'
    },
    id_cittadino: { 
        type: Schema.Types.ObjectId, ref: 'Cittadino'
    },
    rating: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: `{VALUE} non è un numero intero - il rating deve essere di tipo intero`
        }
    },
    commento: String
}));