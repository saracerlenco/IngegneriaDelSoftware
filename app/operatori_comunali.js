const express = ('express');
const router = express.Router();
const operatore_comunale = require('./models/operatore_comunale');

// router.get('/area_personale/{operatore_comunale}', async (req,res) => {
//     let operatore_comunale = await Operatore_comunale.findOne({email: req.bdy.email });
//     res.status(200).json({
//         self:TODO
//     })
// })

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

    res.location("progettoComune/app/cittadini" + operatore_comunaleId).status(201).send(); // ????

});

function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

module.exports = router;