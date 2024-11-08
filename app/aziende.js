const express = ('express');
const router = express.Router();
const azienda = require('./models/azienda');

// router.get('/area_personale/{azienda}', async (req,res) => {
//     let azienda = await Azienda.findOne({email: req.bdy.email });
//     res.status(200).json({
//         self:TODO
//     })
// })

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

    res.location("progettoComune/app/cittadini" + aziendaId).status(201).send(); // ????

});

function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}

module.exports = router;