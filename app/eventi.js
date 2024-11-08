const express = require('express');
const router = express.Router();
const Evento = require('./models/evento.js');

//  ??? In realtà bisognerebbe sostituire un array di eventi
router.get('', async (req,res) => {
    let eventi = await Evento.find({});
    eventi = eventi.map( (evento) => {
        return {
            self: '/api/v1/eventi/'+evento._id,
            nome_evento: evento.nome_evento
        };
    });
    res.status(200).json(eventi);
});

router.use('/:id', async (req,res,next) => {
    let evento = await Evento.findById(req.params.id).exec();
    if(!evento) {
        res.status(404).send()
        console.log('evento non trovato')
        return;
    }
    req['evento'] = evento;
    next()
});

router.get('/:id', async (req,res) => {
    let evento = req['evento'];
    res.status(200).json({
        self: '/eventi' + evento.id_evento,
        nome_evento: evento.nome_evento
    });
});

router.post('', async (req,res) => {
    let evento = new Evento({
        nome_evento: req.body.nome_evento
    });
    evento = await evento.save();
    let eventoId = evento.id_evento;
    console.log('Evento creato con successo');
    res.location("/eventi" + eventoId).status(201).send();
});

module.exports = router;