const request  = require('supertest');    
const app      = require('../app/app');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Evento = require('../app/models/evento.js');
const Feedback = require('../app/models/feedback.js');
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

describe('POST /api/v1/feedbacks/:{id_evento}', () => {
    beforeAll( async () => {
        jest.setTimeout(10000);
        app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });
    
    test('Creazione feedback con successo', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674'
        // Rimuovo il feedback precedente se esiste
        await Feedback.deleteMany({ id_evento: id_evento, id_cittadino: '67321bf8b78fd1a0bb33c677' });
        const res = await request(app)
        .post('/api/v1/feedbacks/'+id_evento)
        .set('x-access-token', tokenCittadino)
        .send({
            rating: 5,
            commento: 'Evento ben organizzato'
        })
        expect(res.status).toBe(201);
    });
    
    test('Dato non valido', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674'
        const res = await request(app)
        .post('/api/v1/feedbacks/'+id_evento)
        .set('x-access-token', tokenCittadino)
        .send({
            rating: '-1', // Dato non valido
            commento: 'Evento ben organizzato'
        })
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Dati mancanti o non validi');
    });

    test('Azione non permessa', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674'
        const res = await request(app)
        .post('/api/v1/feedbacks/'+id_evento)
        .set('x-access-token', tokenComune)
        .send({
            rating: '5',
            commento: 'Evento ben organizzato'
        })
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Utente non autorizzato');
    });
    
    test('Evento non trovato', async () => {
        const id_evento = '67321b91b78fd1a0bb33c600'
        const res = await request(app)
        .post('/api/v1/feedbacks/'+id_evento)
        .set('x-access-token', tokenCittadino)
        .send({
            rating: '5',
            commento: 'Evento ben organizzato'
        })
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Evento non trovato');
    });
    
});
 

describe('GET /api/v1/feedbacks/:{id_evento}', () => {
    beforeAll( async () => {
        jest.setTimeout(8000);
        app.locals.db = await  mongoose.connect(process.env.DB_URL); });
        
        test('Lista feedback di un evento', async () => {
            const id_evento = '67321b91b78fd1a0bb33c674'
            const res = await request(app)
            .get('/api/v1/feedbacks/'+id_evento)
            .set('x-access-token', tokenComune);
            expect(res.status).toBe(200);
        });

        test('Evento non trovato', async () => {
            const id_evento = '67321b91b78fd1a0bb33c600'
            const res = await request(app)
            .get('/api/v1/feedbacks/'+id_evento)
            .set('x-access-token', tokenComune);
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Evento non trovato');
        });

        test('Azione non permessa', async () => {
            const id_evento = '67321b91b78fd1a0bb33c674'
            const res = await request(app)
            .get('/api/v1/feedbacks/'+id_evento)
            .set('x-access-token', tokenAzienda);
            expect(res.status).toBe(403);
        });
        
    });  
    
afterAll( () => {
    mongoose.connection.close(true); 
});