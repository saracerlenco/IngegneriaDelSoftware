const express = require('express');
const router = express.Router();
const Coupon = require('./models/coupon.js');
const eventi = require('./eventi.js');
const { tokenChecker } = require('./tokenChecker.js');
const { findById } = require('./models/cittadino.js');
const evento = require('./models/evento.js');

//  Resituisce una lista di coupon
router.get('', tokenChecker, async (req,res) => {
    try{        
        if(!req.loggedUser){ 
            return res.status(403).json({ error: "Azione non permessa" });
        }
        
        const coupons = await Coupon.find();

        // Invio della lista come risposta
        res.status(200).json(coupons.map(coupon => ({
            self: '/api/v1/coupons',
            id_coupon: coupon._id,
            id_azienda: coupon.id_azienda,
            descrizione_coupon: coupon.descrizione_coupon,
            punti: coupon.punti
        })));

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

// Creazione di un coupon
router.post('', async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'azienda'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la proposta di un coupon"});
        }
        
        if(!req.body.descrizione_coupon){ 
            return res.status(400).json({ error: "Dati mancanti o non validi"});
        }

        let coupon = new Coupon({
            id_azienda: req.loggedUser._id,
            descrizione_coupon: req.body.descrizione_coupon,
        })
        coupon = await coupon.save();

        res.location("/api/v1/coupons").status(201).send();

} catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server, riprova più tardi"});
}
});

// Approvazione coupon e assegnazione punti
router.put('/:id_coupon', tokenChecker, async(req,res) => {
    try{
        let c = await Coupon.findById(req.params.id_coupon);
        if(!req.params.id_coupon || !c){
            return res.status(404).json({ error: "Coupon non trovato"});
        }
        
        if(!req.body.punti){
            return res.status(400).json({ error: "Richiesta non valida: dati mancanti o non validi"});
        }
        const { dati } = req.body;

        if( req.loggedUser.ruolo != 'operatore_comunale'){
            return res.status(403).json({ error: "Azione non permessa"});
        }
        
        const coupon = await Coupon.findOneAndUpdate(
            { _id: req.params.id_coupon },
            { $set: {punti: req.body.punti} }, 
            { new: true }
            
        );
        res.status(200).send();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});


module.exports = router;