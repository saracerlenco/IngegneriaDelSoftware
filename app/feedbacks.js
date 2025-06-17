const express = require('express');
const router = express.Router();
const Feedback = require('./models/feedback.js');
const Evento = require('./models/evento.js');
const { tokenChecker } = require('./tokenChecker.js');

//Sara: aggiunta funzione
router.get('/', tokenChecker, async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'operatore_comunale' && req.loggedUser.ruolo != 'cittadino'){
            return res.status(403).json({ error: 'Utente non autorizzato' });
        }

        // Ricerca dei feedback nel DB in base al filtro
        let feedbacks = await Feedback.find();
        res.status(200).json(feedbacks.map( feedback => ({
            self: `/api/v1/feedbacks/${feedback.id_evento}`,
            id_cittadino: feedback.id_cittadino,
            rating: feedback.rating,
            commento: feedback.commento
        })));

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});


//  Resituisce un array di feedback associati ad un evento
router.get('/:id_evento', tokenChecker, async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'operatore_comunale' && req.loggedUser.ruolo != 'cittadino'){//Sara aggiunto cittadino
            return res.status(403).json({ error: 'Utente non autorizzato' });
        }
        
        let evento = await Evento.findById(req.params.id_evento);
        if (!evento) {
            return res.status(404).json({ error: "Evento non trovato"});
        }
        
        // Il filtro corrisponde all'id_evento
        let filtro = {};
        filtro.id_evento = req.params.id_evento;

        // Ricerca dei feedback nel DB in base al filtro
        let feedbacks = await Feedback.find(filtro);
        res.status(200).json(feedbacks.map( feedback => ({
            self: `/api/v1/feedbacks/${req.params.id_evento}`,
            username: feedback.id_cittadino,
            rating: feedback.rating,
            commento: feedback.commento
        })));

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});


// Creazione nuovo feedback
router.post('/:id_evento', tokenChecker, async (req,res) => {
    try{        
        
        if(req.loggedUser.ruolo != 'cittadino'){
            return res.status(403).json({ error: 'Utente non autorizzato' });
        }

        // Validazione dei dati
        if ((req.body.rating < 1 || req.body.rating > 5) || !req.body.rating ){
            return res.status(400).json({ error: "Dati mancanti o non validi"});
        }

        const id_evento = req.params.id_evento;
        const id_cittadino = req.loggedUser._id;

        // Sara aggiunto CONTROLLA SE ESISTE GIÀ UN FEEDBACK PER QUESTO EVENTO E QUESTO CITTADINO
        const Feedback = require('./models/feedback');
        const already = await Feedback.findOne({ id_evento, id_cittadino });
        if (already) {
            return res.status(409).json({ error: "Hai già lasciato un feedback per questo evento." });
        }

        let evento = await Evento.findById(req.params.id_evento);
        if (!evento) {
            return res.status(404).json({ error: "Evento non trovato"});
        }

        // Creazione nuovo feedback
        let feedback = new Feedback({
            id_evento: req.params.id_evento,
            id_cittadino: req.loggedUser._id,
            commento: req.body.commento,
            rating: req.body.rating
        });

        feedback = await feedback.save();

        res.location(`/api/v1/feedbacks/${req.params.id_evento}`).status(201).send();

} catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server, riprova più tardi"});
}
});

module.exports = router;