const express = require('express');
const router = express.Router();
const Evento = require('./models/evento.js');

//  Resituisce un array di eventi in base a un filtro
router.get('', async (req,res) => {
    try{
        // Creazione di un oggetto di filtro in base ai parametri di query
        let filtro = {};

        if(req.query.tipologia){
            filtro.tipologia = req.query.tipologia;
        }
        if(req.query.data){
            filtro.data = new Date(req.query.data); // converte la data in fomrato Date
        }
        if(req.query.luogo){
            filtro.luogo = req.query.luogo;
        }

        // Ricerca degli eventi dìnel DB in base al filtro
        const eventi = await Evento.find(filtro);

        // Mappa i risultati nel formato JSON richiesto
        const response = eventi.map(evento => ({
            id_evento: evento._id,
            nome_evento: evento,
            data: evento.dara,
            luogo: evento.luogo,
            tipologia: evento.tipologia,
            descrizione: evento.descrizione,
            punti: evento.punti,
            creatore: evento.creatore.username
        }))

        // Invio della lista come risposta
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Errore del server, riprova più tardi"});
    }
});

// router.get('/:id', async (req,res) => {
//     let evento = req['evento'];
//     res.status(200).json({
//         self: '/eventi' + evento.id_evento,
//         nome_evento: evento.nome_evento
//     });
// });

// Creazione nuovo evento
router.post('', async (req,res) => {
    try{
        // TODO: da ricavare la tipologia di creatore dell'evento e verificare che non sia un'azienda (errore 403)
        
        if(!req.body.nome_evento || !req.body.data || !req.body.luogo || !req.body.tipologia || !req.body.descrizione) {
            res.status(400).json({ error: 'Richiesta non valida: dati mancanti o non validi'});
            return;
        }

        let evento = new Evento({
            nome_evento: req.body.nome_evento,
            data: req.body.data,
            luogo: req.body.luogo,
            tipologia: req.body.tipologia,
            descrizione: req.body.descrizione,
            // creatore: COME FARE A RICAVARE L'_ID DEL CREATORE ???
        });
        evento = await evento.save();
        let eventoId = evento.id_evento;
        console.log('Evento creato con successo');
        res.location("/eventi" + eventoId).status(201).send();
} catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server, riprova più tardi"});
}
});

module.exports = router;