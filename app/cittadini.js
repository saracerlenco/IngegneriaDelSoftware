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
    if (!req.body.username || typeof req.body.username != 'string') {
        return res.status(400).json({ error: 'Richiesta non valida: il campo username deve essere di tipo string'});
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
        let cittadino = await Cittadino.findOne({_id: req.loggedUser._id });
        res.status(200).json({
            self: '/api/v1/cittadini',
            nome: cittadino.nome,
            cognome: cittadino.cognome,
            email: cittadino.email,
            codice_fiscale: cittadino.codice_fiscale,
            username: cittadino.username,
            // password: cittadino.password,
            punti: cittadino.punti
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
})

// Rotta aggiunta per vedere gli username
router.get('/all', tokenChecker, async (req,res) => {
    try {        
        let cittadini = await Cittadino.find();
        res.status(200).json(cittadini.map(cittadino => {
            return {
            self: '/api/v1/cittadini/all',
            _id: cittadino._id,
            username: cittadino.username
            }
        }));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
})

// Modifica area personale cittadino
router.put('', tokenChecker, async(req,res) => {
    try{
        const { nome_cittadino, cognome_cittadino, codice_fiscale, username, email, punti } = req.body;
        const update = {};
        if (nome_cittadino) update.nome = nome_cittadino;
        if (cognome_cittadino) update.cognome = cognome_cittadino;
        if (codice_fiscale) update.codice_fiscale = codice_fiscale;
        if (username) update.username = username;
        if (email) update.email = email;
        if (typeof punti !== "undefined") update.punti = punti;

        if(Object.keys(update).length === 0){
            return res.status(400).json({error:"Nessun dato da aggiornare"});
        }

        const cittadino = await Cittadino.findOneAndUpdate(
            { _id: req.loggedUser._id }, 
            { $set: update },
            { new: true }
        );
        if(!cittadino) return res.status(404).json({error:"Cittadino non trovata"});
        res.status(200).send();

    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

module.exports = router;