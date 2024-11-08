require('dotenv').config(); // carica le variabili di ambiente
const app = require('./app.js'); // importa l'app configurata in app.js
const mongoose = require('mongoose');

// connessione al db
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopolgy: true })
.then( () => {
    console.log('Connesso al DB');
    // Avvio del server
    app.listen(port, () => {
        console.log('Server in ascolto sulla porta ${port}');
    });
})    
.catch(err => console.error('Errore di connessione: ', err));
