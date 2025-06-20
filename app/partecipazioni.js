const express = require('express');
const router = express.Router();
const Partecipazione = require('./models/partecipazione.js');
const Evento = require('./models/evento.js');
const { tokenChecker } = require('./tokenChecker.js');

router.post('/:id_evento', tokenChecker, async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'cittadino'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la proposta di un evento"});
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

router.get('', tokenChecker, async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'cittadino'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la visualizzazione delle partecipazioni agli eventi"});
        }
        let filtro = {};
        filtro.id_cittadino = req.loggedUser._id;

        let partecipazioni = await Partecipazione.find(filtro);
        res.status(200).json( partecipazioni.map(partecipazione => ({
            self: `/api/v1/partecipazioni`,
            id_partecipazione: partecipazione._id,
            id_evento: partecipazione.id_evento,
            id_cittadino: req.loggedUser._id
        })));
    } catch (err) { 
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});
// Cancellazione partecipazione
router.delete('/:id_evento', tokenChecker, async (req,res) => {
    try{
        const id_evento = req.params.id_evento;
        const evento = await Evento.findById(id_evento);
        if(req.loggedUser.ruolo != 'cittadino'){
            return res.status(403).json({ error: "Utente non autorizzato" });
        }
        if(!evento){
            return res.status(404).json({ error: "Evento inesistente"});
        }

        const partecipazione = await Partecipazione.findOneAndDelete({
            id_cittadino: req.loggedUser._id,
            id_evento
        });
        if(partecipazione){
            return res.status(204).send();
        }
        res.status(404).json({ error: "Errore: partecipazione inesistente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

module.exports = router;