const bcrypt = require('bcrypt');
const express = require ('express');
const router = express.Router();
const Cittadino = require('./models/cittadino');
const { tokenChecker } = require('./tokenChecker.js');

// Registrazione nuovo cittadino
router.post('', async (req,res) => {
    if(!req.body.nome || typeof req.body.nome != 'string') {
        return res.status(400).json({ error: 'Richiesta non valida: il campo nome deve essere di tipo string'});
    } 
    if (!req.body.cognome || typeof req.body.cognome != 'string') {
        return res.status(400).json({ error: 'Richiesta non valida: il campo cognome deve essere di tipo string'});
    } 
    if (!req.body.email || typeof req.body.email != 'string' || !checkIfEmailInString(req.body.email)) {
        return res.status(400).json({ error: 'Richiesta non valida: il campo email deve essere di tipo string di formato email'});
    } 
    if (!req.body.codice_fiscale || typeof req.body.codice_fiscale != 'string') {
        return res.status(400).json({ error: 'Richiesta non valida: il campo codice_fiscale deve essere di tipo string'});
    }
    if (!req.body.password || typeof req.body.password != 'string') {
        return res.status(400).json({ error: 'Richiesta non valida: il campo codice_fiscale deve essere di tipo string'});
    }
    try{
        //
        const password = req.body.password;
        bcrypt.hash(password, 1, async (err, hashedPassword) => {
            if (err) throw err;
            // Quando crei l'utente, salva hashedPassword nel database
            let cittadino = new Cittadino({
                nome: req.body.nome,
                cognome: req.body.cognome,
                email: req.body.email,
                codice_fiscale: req.body.codice_fiscale,
                username: req.body.username,
                password: hashedPassword // Salva la password cifrata
            });
            cittadino = await cittadino.save();
    
            res.location("/api/v1/cittadini").status(201).send();
        });
        //
        // let cittadino = new Cittadino({
        // nome: req.body.nome,
        // cognome: req.body.cognome,
        // email: req.body.email,
        // codice_fiscale: req.body.codice_fiscale,
        // username: req.body.username,
        // password: req.body.password,
        // });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }

});

// Visualizzazione area personale del cittadino
router.get('', tokenChecker, async (req,res) => {
    try {        
        let cittadino = await Cittadino.findOne({email: req.loggedUser.email });
        res.status(200).json({
            self: '/api/v1/cittadini',
            nome: cittadino.nome,
            cognome: cittadino.cognome,
            email: cittadino.email,
            codice_fiscale: cittadino.codice_fiscale,
            username: cittadino.username,
            password: cittadino.password,
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
})

// Modifica area personale cittadino DA RIVEDERE 
router.put('', tokenChecker, async(req,res) => {
    try{
        const { dati } = req.body;
        if(!dati){ return res.status(400).json({error:"Richiesta non valida"})};

        const cittadino = await Cittadino.findOneAndUpdate(
            { email: req.loggedUser.email },
            { $set: dati },
            { new: true }
        );
        res.status(200).json({ message: "Dati modificati con successo" });

    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
})

function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

module.exports = router;