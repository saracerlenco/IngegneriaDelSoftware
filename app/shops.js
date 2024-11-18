const express = require('express');
const router = express.Router();
const Shop = require('./models/shop.js');
const Coupon = require('./models/coupon.js');

router.get('', async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'cittadino'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la proposta di un coupon"});
        }
        
        let filtro = {};
        filtro.id_cittadino = req.loggedUser._id;

        let shops = await Shop.find(filtro);
        res.status(200).json( shops.map(shop => ({
            self: `/api/v1/shops/${shop.id_evento}`,
            //id_shop: shop._id,
            id_cittadino: req.loggedUser._id,
            id_coupon: shop.id_coupon
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

        let shop = new Shop({
            id_coupon: req.params.id_coupon,
            id_cittadino: req.loggedUser._id
        });
        shop = await shop.save();
        res.location(`/api/v1/shops/${req.params.id_coupon}`).status(201).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

module.exports = router;