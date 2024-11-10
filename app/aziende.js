const express = require('express');
const router = express.Router();
const Azienda = require('./models/azienda');

// Registrazione nuova azienda
router.post('', async (req,res) => {
    let azienda = new Azienda({
        nome_azienda: req.body.email,
        partita_IVA: req.body.partita_IVA,
        email: req.body.email,
        password: req.body.password,
    });

    if(!azienda.nome_azienda || typeof azienda.nome_azienda != 'string') {
        res.status(400).json({ error: 'Il campo nome deve essere di tipo string'});
        return;
    } 
    if (!azienda.partita_IVA || typeof azienda.partita_IVA != 'string') {
        res.status(400).json({ error: 'Il campo cognome deve essere di tipo string'});
        return;
    } 
    if (!azienda.email || typeof azienda.email != 'string' || !checkIfEmailInString(azienda.email)) {
        res.status(400).json({ error: 'Il campo email deve essere di tipo string di formato email'});
        return;
    } 
    
    azienda = await azienda.save();

    let aziendaId = azienda.id;

    res.location("/api/v1/aziende" + aziendaId).status(201).send(); // ????

});

// Visualizzazione area personale dell'azienda
router.get('', async (req,res) => {
    if(!req.loggedUser) { return; }
    
    let azienda = await Azienda.findOne({email: req.body.email });
    res.status(200).json({
        self: 'api/v1/azienda',
        nome: azienda.nome_azienda,
        partita_IVA: azienda.partita_IVA,
        email: azienda.email,
        password: azienda.password
    })
})

// Modifica area personale azienda DA RIVEDERE 
router.put('', async(req,res) => {
    try{
        const { dati } = req.body;
        if(!dati){ return res.status(400).json({error:"Richiesta non valida: dati mancanti o non validi"})};

        const azienda = await Azienda.findOneAndUpdate(
            { email: req.loggedUser.email },
            { $set: dati },
            { new: true }
        );
        res.status(200).json({
            message: "Dati modificati con successo",
            dati: azienda
        });

    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
})

function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

module.exports = router;