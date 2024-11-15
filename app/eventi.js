const express = require('express');
const router = express.Router();
const Evento = require('./models/evento.js');
const tokenChecker = require('./tokenChecker.js');

//  Resituisce un array di eventi in base a un filtro
router.get('', async (req,res) => {
    try{
        // Creazione di un oggetto di filtro in base ai parametri di query
        let filtro = {};

        if(req.query.tipologia){
            filtro.tipologia = req.query.tipologia;
        }
        if(req.query.data){
            filtro.data = new Date(req.query.data); // converte la data in formato Date
        }
        if(req.query.luogo){
            filtro.luogo = req.query.luogo;
        }

        // Ricerca degli eventi nel DB in base al filtro
        const eventi = await Evento.find(filtro);

        // Invio della lista come risposta
        res.status(200).json(eventi.map(evento => ({
            self: '/api/v1/eventi',
            id_evento: evento._id,
            nome_evento: evento.nome_evento,
            data: evento.data,
            luogo: evento.luogo,
            tipologia: evento.tipologia,
            descrizione: evento.descrizione,
            punti: evento.punti,
            creatore: evento.creatore.username
        })));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

// Creazione nuovo evento
router.post('', tokenChecker, async (req,res) => {
    try{
        if(req.loggedUser.ruolo=='azienda'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette la proposta di eventi"});
        }
        
        if(!req.body.nome_evento || !req.body.data || !req.body.luogo || !req.body.tipologia || !req.body.descrizione) {
            return res.status(400).json({ error: 'Richiesta non valida: dati mancanti o non validi'});
        }

        let evento = new Evento({
            nome_evento: req.body.nome_evento,
            data: req.body.data,
            luogo: req.body.luogo,
            tipologia: req.body.tipologia,
            descrizione: req.body.descrizione,
            creatore: req.loggedUser._id
        });
        evento = await evento.save();
        //console.log('Evento creato con successo');
        res.location("/api/v1/eventi").status(201).send();
} catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Errore del server, riprova più tardi"});
}
});

// DA CONTROLLARE SU POSTMAN
router.put('/:id_evento', tokenChecker, async (req,res) => {
    try{
        if(req.loggedUser.ruolo != 'operatore_comunale'){
            return res.status(403).json({ error: "Azione non permessa: la tipologia di utente non permette l'assegnazione di punti ad un evento"});
        }
        if(!req.params.id_evento){
            return res.status(404).json({ error: "Evento non trovato"});
        }
        const dati = req.body;
        if(!dati) {
            return res.status(400).json({ error: "Richiesta non valida: dati mancanti o non validi"});
        }
        
        const evento = await Evento.findOneAndUpdate(
            { _id: req.params.id_evento },
            { $set: dati },
            { new: true }
        );
        res.status(200).send();
    } catch(err) {
        console.error(err);
        return res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

module.exports = router;