const express = ('express');
const router = express.Router();
const operatore_comunale = require('./models/operatore_comunale');

// Registrazione nuovo operatore_comunale
router.post('', async (req,res) => {
    let operatore_comunale = new Operatore_comunale({
        nome: req.body.email,
        cognome: req.body.cognome,
        email: req.body.email,
        codice_fiscale: req.body.codice_fiscale,
        password: req.body.password,
    });

    if(!operatore_comunale.nome || typeof operatore_comunale.nome != 'string') {
        res.status(400).json({ error: 'Il campo nome deve essere di tipo string'});
        return;
    } 
    if (!operatore_comunale.cognome || typeof operatore_comunale.cognome != 'string') {
        res.status(400).json({ error: 'Il campo cognome deve essere di tipo string'});
        return;
    } 
    if (!operatore_comunale.email || typeof operatore_comunale.email != 'string' || !checkIfEmailInString(operatore_comunale.email)) {
        res.status(400).json({ error: 'Il campo email deve essere di tipo string di formato email'});
        return;
    } 
    if (!operatore_comunale.codice_fiscale || typeof operatore_comunale.codice_fiscale != 'string') {
        res.status(400).json({ error: 'Il campo codice_fiscale deve essere di tipo string'});
        return;
    }
    
    operatore_comunale = await operatore_comunale.save();

    let operatore_comunaleId = operatore_comunale.id;

    res.location("/ap1/v1/operatori_comunali" + operatore_comunaleId).status(201).send(); // ????

});


// Visualizzazione area personale dell'operatore_comunale
router.get('', async (req,res) => {
    if(!req.loggedUser) { return; }
    
    let operatore_comunale = await Operatore_Comunale.findOne({email: req.body.email });
    res.status(200).json({
        self: 'api/v1/azienda',
        nome: operatore_comunale.nome,
        cognome: operatore_comunale.cognome,
        email: operatore_comunale.email,
        codice_fiscale: operatore_comunale.codice_fiscale,
        password: operatore_comunale.password
    })
})

// Modifica area personale operatore_comunale DA RIVEDERE 
router.put('', async(req,res) => {
    try{
        const { dati } = req.body;
        if(!dati){ return res.status(400).json({error:"Richiesta non valida: dati mancanti o non validi"})};

        const operatore_comunale = await Operatore_Comunale.findOneAndUpdate(
            { email: req.loggedUser.email },
            { $set: dati },
            { new: true }
        );
        res.status(200).json({
            message: "Dati modificati con successo",
            dati: operatore_comunale
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