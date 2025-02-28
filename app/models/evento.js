const mongoose = require('mongoose');
const Schema = mongoose.Schema;
module.exports = mongoose.model('Evento', new Schema({
    nome_evento: String,
    data: Date,
    luogo: String,
    tipologia: {
        type: String,
        enum: ['sportivo', 'culturale', 'volontariato']
    },
    descrizione: String,
    punti: {
        type: Number,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} non è un numero intero - i punti devono essere di tipo intero'
        },
        default: "0"
    },
    creatore: {
        type: Schema.Types.ObjectId, ref: 'Cittadino' | 'Operatore_Comunale'
    }
}));