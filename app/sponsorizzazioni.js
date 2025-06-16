const express = require('express');
const router = express.Router();
const Sponsorizzazione = require('./models/sponsorizzazione.js');
const Evento = require('./models/evento.js');
const Azienda = require('./models/azienda.js')
const sponsorizzazione = require('./models/sponsorizzazione.js');
const { tokenChecker } = require('./tokenChecker.js');

router.post('/:id_evento', tokenChecker, async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'azienda'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la proposta di un coupon"});
        }
        
        let evento = await Evento.findById(req.params.id_evento);
        if(!evento){
            return res.status(404).json({ error: "Evento non trovato"});
        }

        let sponsorizzazione = new Sponsorizzazione({
            id_evento: req.params.id_evento,
            id_azienda: req.loggedUser._id
        });
        sponsorizzazione = await sponsorizzazione.save();
        res.location(`/api/v1/sponsorizzazioni/${req.params.id_evento}`).status(201).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

/* router.get('', tokenChecker, async (req,res) => {
    try{
        let filtro = {};
        filtro.id_evento = req.params.id_evento;
        if(req.loggedUser.ruolo != 'azienda'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la proposta di un coupon"});
        }

        let sponsorizzazioni= await Sponsorizzazione.find(filtro);
        res.status(200).json( sponsorizzazioni.map(sponsorizzazione => ({
            self: `/api/v1/sponsorizzazioni/${sponsorizzazione.id_evento}`,
            id_sponsorizzazione: sponsorizzazione._id,
            id_evento: sponsorizzazione.id_evento, //Sara: aggiunto mancava
            id_azienda: req.loggedUser._id
        })));
    } catch (err) { 
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
}); */
//Sara: funzione aggiornata
router.get('', tokenChecker, async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'azienda'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la proposta di un coupon"});
        }
        let filtro = { id_azienda: req.loggedUser._id }; 
        let sponsorizzazioni= await Sponsorizzazione.find(filtro);
        res.status(200).json( sponsorizzazioni.map(sponsorizzazione => ({
            self: `/api/v1/sponsorizzazioni/${sponsorizzazione.id_evento}`,
            id_sponsorizzazione: sponsorizzazione._id,
            id_evento: sponsorizzazione.id_evento,
            id_azienda: req.loggedUser._id
        })));
    } catch (err) { 
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

// Cancellazione sponsorizzazione
router.delete('/:id_evento', tokenChecker, async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'azienda'){
            return res.status(403).json({ error: "Utente non autorizzato" });
        }
        
        const id_evento = req.params.id_evento;
        const evento = await Evento.findById(id_evento);
        if(!evento) {
            return res.status(404).json({ error: "Evento inesistente" });
        }

        const sponsorizzazione = await Sponsorizzazione.findOneAndDelete({
            id_azienda: req.loggedUser._id,
            id_evento
        });
        if(sponsorizzazione){
            return res.status(204).json({
            message: "Sponsorizzazione eliminata con successo"
            });
        }
        res.status(404).json({ error: "Errore: sponsorizzazione inesistente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});


module.exports = router;