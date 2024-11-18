const express = require('express');
const router = express.Router();
const Azienda = require('./models/azienda');
const { tokenChecker } = require('./tokenChecker');

// Registrazione nuova azienda
router.post('', async (req,res) => {
    try{
        let azienda = new Azienda({
        nome_azienda: req.body.email,
        partita_IVA: req.body.partita_IVA,
        email: req.body.email,
        password: req.body.password,
        });

        if(!azienda.nome_azienda || typeof azienda.nome_azienda != 'string') {
            return res.status(400).json({ error: 'Il campo nome deve essere di tipo string'});
        } 
        if (!azienda.partita_IVA || typeof azienda.partita_IVA != 'string') {
            return res.status(400).json({ error: 'Il campo cognome deve essere di tipo string'});
        } 
        if (!azienda.email || typeof azienda.email != 'string' || !checkIfEmailInString(azienda.email)) {
            return res.status(400).json({ error: 'Il campo email deve essere di tipo string di formato email'});
        } 
        
        azienda = await azienda.save();

        res.location("/api/v1/aziende").status(201).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }

});

// Visualizzazione area personale dell'azienda
router.get('', tokenChecker, async (req,res) => {    
    let azienda = await Azienda.findOne({email: req.loggedUser.email });
    res.status(200).json({
        self: '/api/v1/aziende',
        nome: azienda.nome_azienda,
        partita_IVA: azienda.partita_IVA,
        email: azienda.email,
    })
})

// Modifica area personale azienda DA RIVEDERE 
router.put('', tokenChecker, async(req,res) => {
    try{
        const { dati } = req.body;
        if(!dati){ return res.status(400).json({error:"Richiesta non valida: dati mancanti o non validi"})};

        const azienda = await Azienda.findOneAndUpdate(
            { email: req.loggedUser.email },
            { $set: dati },
            { new: true }
        );
        res.status(200).send();

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