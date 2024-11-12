const express = require ('express');
const router = express.Router();
const Cittadino = require('./models/cittadino');
const tokenChecker = require('./tokenChecker');

// Registrazione nuovo cittadino
router.post('', async (req,res) => {
    try{
        let cittadino = new Cittadino({
        nome: req.body.nome,
        cognome: req.body.cognome,
        email: req.body.email,
        codice_fiscale: req.body.codice_fiscale,
        username: req.body.username,
        password: req.body.password,
        });

        if(!cittadino.nome || typeof cittadino.nome != 'string') {
            return res.status(400).json({ error: 'Richiesta non valida: il campo nome deve essere di tipo string'});
        } 
        if (!cittadino.cognome || typeof cittadino.cognome != 'string') {
            return res.status(400).json({ error: 'Richiesta non valida: il campo cognome deve essere di tipo string'});
        } 
        if (!cittadino.email || typeof cittadino.email != 'string' || !checkIfEmailInString(cittadino.email)) {
            return res.status(400).json({ error: 'Richiesta non valida: il campo email deve essere di tipo string di formato email'});
        } 
        if (!cittadino.codice_fiscale || typeof cittadino.codice_fiscale != 'string') {
            return res.status(400).json({ error: 'Richiesta non valida: il campo codice_fiscale deve essere di tipo string'});
        }
        
        cittadino = await cittadino.save();

        res.location("/api/v1/cittadini").status(201).send();
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
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
})

function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

module.exports = router;