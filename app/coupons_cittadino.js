const express = require('express');
const router = express.Router();
const Coupon_Cittadino = require('./models/coupon_cittadino.js');
const Coupon = require('./models/coupon.js');

router.get('', async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'cittadino'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la proposta di un coupon"});
        }
        
        let filtro = {};
        filtro.id_cittadino = req.loggedUser._id;

        let coupons_cittadino = await Coupon_Cittadino.find(filtro);
        res.status(200).json( coupons_cittadino.map(coupon_cittadino => ({
            self: `/api/v1/coupons_cittadino/${coupon_cittadino.id_evento}`,
            id_cittadino: req.loggedUser._id,
            id_coupon: coupon_cittadino.id_coupon
        })));
    } catch (err) { 
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

router.post('/:id_coupon', async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'cittadino'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la proposta di un coupon"});
        }
        
        let coupon = await Coupon.findById(req.params.id_coupon);
        if(!coupon){
            return res.status(404).json({ error: "Coupon non trovato"});
        }

        let coupon_cittadino = new Coupon_Cittadino({
            id_coupon: req.params.id_coupon,
            id_cittadino: req.loggedUser._id
        });
        coupon_cittadino = await coupon_cittadino.save();
        res.location(`/api/v1/coupons_cittadino/${req.params.id_coupon}`).status(201).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

module.exports = router;