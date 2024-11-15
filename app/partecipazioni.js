const express = require('express');
const router = express.Router();
const Partecipazione = require('./models/partecipazione.js');
const Evento = require('./models/evento.js');

router.post('/:id_evento', async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'cittadino'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la proposta di un coupon"});
        }
        
        let evento = await Evento.findById(req.params.id_evento);
        if(!evento){
            return res.status(404).json({ error: "Evento non trovato"});
        }

        let partecipazione = new Partecipazione({
            id_evento: req.params.id_evento,
            id_cittadino: req.loggedUser._id
        });
        partecipazione = await partecipazione.save();
        res.location(`/api/v1/partecipazioni/${req.params.id_evento}`).status(201).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

router.get('/:id_evento', async (req,res) => {
    try{
        let filtro = {};
        filtro.id_evento = req.params.id_evento;
        if(!filtro){
            return res.status(404).json({ error: "Evento non trovato"});
        }

        let partecipazioni = await Partecipazione.find(filtro);
        res.status(200).json( partecipazioni.map(partecipazione => ({
            self: `/api/v1/partecipazioni/${partecipazione.id_evento}`,
            id_partecipazione: partecipazione._id,
            // id_evento: partecipazione.id_evento non credo sia necessario
            id_cittadino: req.loggedUser._id
        })));
    } catch (err) { 
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

// Cancellazione coupon
router.delete('/:id_evento', async (req,res) => {
    try{
        const id_evento = req.params.id_evento;
        const evento = await Evento.findById(id_evento);
        if(!evento) {
            return res.status(404).json({ error: "Errore: evento inesistente" });
        }

        const partecipazione = await Partecipazione.findOneAndDelete({
            id_cittadino: req.loggedUser._id,
            id_evento
        });
        if(partecipazione){
            return res.status(204).json({
            message: "Coupon eliminato con successo"
            });
        }
        res.status(404).json({ error: "Errore: partecipazione inesistente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

module.exports = router;