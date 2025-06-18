const request  = require('supertest');    
const app      = require('../app/app');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Evento = require('../app/models/evento.js');
require('dotenv').config();


let tokenCittadino = jwt.sign( 
  {email: 'mario.rossi@mail.com', _id: '68527f9d30f8acbd472e9708', ruolo: 'cittadino'},
  process.env.JWT_SECRET, 
  {expiresIn: 43200} 
);
let tokenAzienda = jwt.sign( 
  {email: 'azienda@mail.com', _id: '68527da629e0851f7f8c39c6', ruolo: 'azienda'},
  process.env.JWT_SECRET, 
  {expiresIn: 43200} 
);
let tokenComune = jwt.sign( 
  {email: 'mario.rossi@mail.com', _id: '68527da098e8fce64da5ea56', ruolo: 'operatore_comunale'},
  process.env.JWT_SECRET, 
  {expiresIn: 43200} 
);


describe('GET /api/v1/eventi', () => {
  beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); });

    // Lista eventi senza filtri
    test('GET /api/v1/eventi senza filtri', () => {
    return request(app).get('/api/v1/eventi')
    .expect(200);
  });

    // Lista eventi con filtri - tipologia = Culturale
    test('GET /api/v1/eventi con filtro "tipologia"', async () => {
        const res = await request(app)
        .get('/api/v1/eventi')
        .query({tipologia: 'culturale'})
        .expect(200);
        // verifica che la risposta sia un array e contenga eventi tipologia = culturale
        expect(res.body).toBeInstanceOf(Array);
        res.body.forEach(evento => {
            expect(evento.tipologia).toBe('culturale');
        });
    });

    // Lista eventi con filtri - tipologia = Sportivo
    test('GET /api/v1/eventi con filtro "tipologia"', async () => {
        const res = await request(app)
        .get('/api/v1/eventi')
        .query({tipologia: 'sportivo'})
        .expect(200);
        // verifica che la risposta sia un array e contenga eventi tipologia = sportivo
        expect(res.body).toBeInstanceOf(Array);
        res.body.forEach(evento => {
            expect(evento.tipologia).toBe('sportivo');
        });
    });

    // Lista eventi con filtri - tipologia = Volontariato
    test('GET /api/v1/eventi con filtro "tipologia"', async () => {
        const res = await request(app)
        .get('/api/v1/eventi')
        .query({tipologia: 'volontariato'})
        .expect(200);
        // verifica che la risposta sia un array e contenga eventi tipologia = volontariato
        expect(res.body).toBeInstanceOf(Array);
        res.body.forEach(evento => {
            expect(evento.tipologia).toBe('volontariato');
        });
    });

    // Lista eventi con filtri - data
    test('GET /api/v1/eventi con filtro "data', async () => {
        const res = await request(app)
        .get('/api/v1/eventi')
        .query({ data: '2024-12-01'})
        .expect(200);
        expect(res.body).toBeInstanceOf(Array);
        res.body.forEach(evento => {
            const dataEvento = new Date(evento.data);
            const data = new Date('2024-12-01');
            expect(dataEvento==data).toBe(true);
        });
    });

    // Lista eventi con filtri - luogo
    test('GET /api/v1/eventi con filtro "luogo"', async () => {
        const res = await request(app)
        .get('/api/v1/eventi')
        .query({ luogo: 'Piazza Duomo'})
        .expect(200);
        expect(res.body).toBeInstanceOf(Array);
        res.body.forEach(evento => {
            const luogoEvento = evento.luogo;
            const luogo = 'Piazza Duomo';
            expect(luogoEvento==luogo).toBe(true);
        });
    });
});


describe('POST /api/v1/eventi', () => {
    beforeAll( async () => {
      jest.setTimeout(10000);
      app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });

    test('Creazione evento negato al tipo di utente azienda', async () => {
        const res = await request(app)
        .post('/api/v1/eventi')
        .set('x-access-token', tokenAzienda)
        .send({
            nome_evento: 'Evento Test',
            data: '2024-12-31',
            luogo: 'Piazza Duomo',
            tipologia: 'Culturale',
            descrizione: 'Un evento test'
        });
        expect(res.status).toBe(403);
        expect(res.body.error).toBe(
            'Azione non permessa: la tipologia di utente non permette la proposta di eventi'
        );
    });
    
    test('Proposta di un evento non valida per dati mancanti', async () => {
        const res = await request(app)
        .post('/api/v1/eventi')
        .set('x-access-token', tokenCittadino)
        .send({
            nome_evento: '', // dato mancante
            data: '2024-12-20',
            luogo: 'Parco ...',
            tipologia: 'sportivo',
            descrizione: 'Partita a calcio'
        });
        expect(res.status).toBe(400);
    });

    test('Proposta evento avvenuta con successo - evento creato', async () => {
        expect.assertions(1)
        const res = await request(app)
        .post('/api/v1/eventi')
        .set('x-access-token', tokenCittadino)
        .send({
            nome_evento: 'Evento di prova',
            data: '2025-5-20',
            luogo: 'Piazza Duomo',
            tipologia: 'sportivo',
            descrizione: 'Evento creato per il testing'
        });
        expect(res.status).toBe(201);
    });
});

afterAll( () => {
    mongoose.connection.close(true); 
});