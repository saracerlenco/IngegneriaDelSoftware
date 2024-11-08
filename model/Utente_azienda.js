var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Utente_azienda', new Schema({ 
	username: String,
    password: String
}));