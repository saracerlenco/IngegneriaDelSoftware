// Aggiungere accesso con credenziali Google???
const express = require('express');
const router = express.Router();
const Cittadino = require('./models/cittadino');
const Operatore_Comunale = require('./models/operatore_comunale');
const Azienda = require('./models/azienda');
const jwt = require('jsonwebtoken');

router.post('', async function(req,res) {
    // Verifica della tipologia di utente TODO
    if(req.body.ruolo=='cittadino') {
        let utente = await Cittadino.findOne({ email: req.body.email }).exec()
    } else if(req.body.ruolo=='azienda'){
        let utente = await Azienda.findOne({ email: req.body.email }).exec()
    } else {
        let utente = await Operatore_Comunale.findOne({ email: req.body.email }).exec()
    }
    
    // Autenticazione dell'utente
    if(!utente) res.json({
        success: false,
        message: 'Utente non trovato'
    })
    if(utente.password != req.body.password) res.json({
        succes: false,
        message: 'Utente non trovato'
    })

    // Creazione del token
    const payload = { 
        email: utente.email,
        id: utente._id,
        other_data: encrypted_in_the_token
    }
    const options = { expiresIn: 86400 } //il token ha validità 24h
    const token = jwt.sign(payload,proccess.env.JWT_SECRET, options);

    res.json({
        success: true,
        message: 'Token creato con successo',
        token: token,
        email: utente.email,
        id: utente._id,
        self: "api/v1/"+utente._id
    });
});

module.exports = router;