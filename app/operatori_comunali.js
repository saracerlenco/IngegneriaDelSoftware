const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const Operatore_Comunale = require('./models/operatore_comunale');
const { tokenChecker } = require('./tokenChecker');

// Registrazione nuovo operatore_comunale
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
    try{
         //
        const password = req.body.password;
        bcrypt.hash(password, 1, async (err, hashedPassword) => {
        if (err) throw err;
        // Quando crei l'utente, salva hashedPassword nel database
        let operatore_comunale = new Operatore_Comunale({
            nome: req.body.email,
            cognome: req.body.cognome,
            email: req.body.email,
            codice_fiscale: req.body.codice_fiscale,
            password: hashedPassword,
        });
        
        operatore_comunale = await operatore_comunale.save();

        res.location("/api/v1/operatori_comunali").status(201).send();
    });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }

});


// Visualizzazione area personale dell'operatore_comunale
router.get('', tokenChecker, async (req,res) => {
    try{        
        let operatore_comunale = await Operatore_Comunale.findOne({_id: req.loggedUser._id });
        if (!operatore_comunale) {
            return res.status(404).json({ error: "Operatore comunale non trovato" });
        }
        res.status(200).json({
            self: '/api/v1/operatori_comunali/' + operatore_comunale._id,
            nome: operatore_comunale.nome,
            cognome: operatore_comunale.cognome,
            email: operatore_comunale.email,
            codice_fiscale: operatore_comunale.codice_fiscale,
        })
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
})

// Modifica area personale operatore_comunale DA RIVEDERE 
// Sara: sistemata
router.put('', tokenChecker, async(req,res) => {
    try{
        const { nome_operatore_comunale, cognome_operatore_comunale, codice_fiscale, email } = req.body;
        const update = {};
        if (nome_operatore_comunale) update.nome = nome_operatore_comunale;
        if (cognome_operatore_comunale) update.cognome = cognome_operatore_comunale;
        if (codice_fiscale) update.codice_fiscale = codice_fiscale;
        if (email) update.email = email;

        if(Object.keys(update).length === 0){
            return res.status(400).json({error:"Nessun dato da aggiornare"});
        }

        const operatore_comunale = await Operatore_Comunale.findOneAndUpdate(
            { _id: req.loggedUser._id }, 
            { $set: update },
            { new: true }
        );
        if(!operatore_comunale) return res.status(404).json({error:"Operatore non trovato"});
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