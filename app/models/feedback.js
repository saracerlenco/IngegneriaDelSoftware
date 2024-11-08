const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Feedback', new Schema({
    commento: String,
    id_evento: {
        type: String,
        ref: 'Evento'
    },
    username: { 
        type: Schema.Types.username, ref: 'Cittadino'
    },
    rating: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} non è un numero intero - il rating deve essere di tipo intero'
        }
    }
}));