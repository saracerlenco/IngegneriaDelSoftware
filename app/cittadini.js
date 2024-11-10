const express = require ('express');
const router = express.Router();
const Cittadino = require('./models/cittadino');

// Registrazione nuovo cittadino
router.post('', async (req,res) => {
    let cittadino = new Cittadino({
        nome: req.body.email,
        cognome: req.body.cognome,
        email: req.body.email,
        codice_fiscale: req.body.codice_fiscale,
        username: req.body.username,
        password: req.body.password,
    });

    if(!cittadino.nome || typeof cittadino.nome != 'string') {
        res.status(400).json({ error: 'Il campo nome deve essere di tipo string'});
        return;
    } 
    if (!cittadino.cognome || typeof cittadino.cognome != 'string') {
        res.status(400).json({ error: 'Il campo cognome deve essere di tipo string'});
        return;
    } 
    if (!cittadino.email || typeof cittadino.email != 'string' || !checkIfEmailInString(cittadino.email)) {
        res.status(400).json({ error: 'Il campo email deve essere di tipo string di formato email'});
        return;
    } 
    if (!cittadino.codice_fiscale || typeof cittadino.codice_fiscale != 'string') {
        res.status(400).json({ error: 'Il campo codice_fiscale deve essere di tipo string'});
        return;
    }
    
    cittadino = await cittadino.save();

    let cittadinoId = cittadino.id;

    res.location("/api/v1/cittadini" + cittadinoId).status(201).send();

});

// Visualizzazione area personale del cittadino
router.get('', async (req,res) => {
    if(!req.loggedUser) { return; }
    
    let cittadino = await Cittadino.findOne({email: req.body.email });
    res.status(200).json({
        self: 'api/v1/cittadino',
        nome: cittadino.nome,
        cognome: cittadino.cognome,
        email: cittadino.email,
        codice_fiscale: cittadino.codice_fiscale,
        username: cittadino.username,
        password: cittadino.password
    })
})

// Modifica area personale cittadino DA RIVEDERE 
router.put('', async(req,res) => {
    try{
        const { dati } = req.body;
        if(!dati){ return res.status(400).json({error:"Richiesta non valida: dati mancanti o non validi"})};

        const cittadino = await Cittadino.findOneAndUpdate(
            { email: req.loggedUser.email },
            { $set: dati },
            { new: true }
        );
        res.status(200).json({
            message: "Dati modificati con successo",
            dati: cittadino
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