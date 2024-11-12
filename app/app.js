const Path = require('path');

const express= require('express');
const app = express();

// Rotta di esempio
app.get('/', (req,res) => {
    res.send('hello world!');
});

// authentication
const authentication = require('./authentication.js');
const tokenChecker = require('./tokenChecker');

// importazione file che definiscono le rotte
const cittadini = require('./cittadini.js');
const operatori_comunali = require('./operatori_comunali.js');
const aziende = require('./aziende.js');
const eventi = require('./eventi.js');
const feedbacks = require('./feedbacks.js');
const coupons = require('./coupons.js');
const partecipazioni = require('./partecipazioni.js');
const sponsorizzazioni = require('./sponsorizzazioni.js');

// configurazione middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Definizione rotte
app.use('/api/v1/sessions', authentication);

app.use('/api/v1/cittadini', cittadini);

app.use('/api/v1/operatori_comunali', operatori_comunali);

app.use('/api/v1/aziende', aziende);

app.use('/api/v1/eventi', eventi);

app.use('/api/v1/feedbacks', tokenChecker);
app.use('/api/v1/feedbacks', feedbacks);

app.use('/api/v1/coupons', tokenChecker);
app.use('/api/v1/coupons', coupons);

app.use('/api/v1/partecipazioni', tokenChecker);
app.use('/api/v1/partecipazioni', partecipazioni);

app.use('/api/v1/sponsorizzazioni', tokenChecker);
app.use('/api/v1/sponsorizzazioni', sponsorizzazioni);

//Esportazione apllicazione configurata
module.exports = app;