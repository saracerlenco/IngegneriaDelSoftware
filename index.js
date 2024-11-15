require('dotenv').config(); // carica le variabili di ambiente
const app = require('./app/app.js'); // importa l'app configurata in app.js
const mongoose = require('mongoose');

const port = process.env.PORT || 8000;

// connessione al db
mongoose.connect(process.env.DB_URL)
.then( () => {
    console.log('Connesso al DB');
    // Avvio del server
    app.listen(port, () => {
        console.log(`Server in ascolto sulla porta ${port}`);
    });
})    
.catch(err => console.error('Errore di connessione: ', err));