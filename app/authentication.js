// Aggiungere accesso con credenziali Google???
const express = require('express');
const router = express.Router();
const Cittadino = require('./models/cittadino');
const Operatore_Comunale = require('./models/operatore_comunale');
const Azienda = require('./models/azienda');
const jwt = require('jsonwebtoken');
const { tokenChecker, revoke } = require('./tokenChecker');

router.post('', async function(req,res) {
    let utente = {};
    
    if(req.body.ruolo == 'cittadino') {
        console.log(await Cittadino.find({}))
        utente = await Cittadino.findOne({ email: req.body.email }).lean();
        console.log("Utente: " + utente);
    } else if(req.body.ruolo == 'azienda'){
        utente = await Azienda.findOne({ email: req.body.email }).exec();
    } else {
        utente = await Operatore_Comunale.findOne({ email: req.body.email }).exec();
    }

    
    // Autenticazione dell'utente
    if(!utente) return res.status(404).json({
        success: false,
        message: 'Utente non trovato'
    })
    utente.ruolo = req.body.ruolo;
    if(utente.password != req.body.password) return res.status(401).json({ error: "Errore: Token non valido o inesistente" });

    // Creazione del token
    const payload = { 
        email: utente.email,
        _id: utente._id,
        ruolo: utente.ruolo
    }
    const options = { expiresIn: 43200 } //il token ha validità 12h
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);

    res.json({
        message: 'Token creato con successo',
        token: token,
        email: utente.email,
        id: utente._id,
        self: "/api/v1/cittadini"
    });
});

router.delete('', async (req,res) => {
    try{
        const token = req.header.authorization?.split(' '[1]);
        if(token){
            revoke(token);
            return res.status(401).json({ error: "Errore: Token non valido o inesistente"})
        }
        
        res.status(204).json({ message: "Logout effettuato con successo"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
})

module.exports = router;