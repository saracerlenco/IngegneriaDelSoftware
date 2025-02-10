const request  = require('supertest');    
const app      = require('../app/app');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Evento = require('../app/models/evento.js');
require('dotenv').config({ path: './../.env' });

let tokenCittadino = jwt.sign( 
    {email: 'John@mail.com', _id: '67321bf8b78fd1a0bb33c677', ruolo: 'cittadino'},
    process.env.JWT_SECRET, 
    {expiresIn: 43200} 
);
let tokenComune = jwt.sign( 
    {email: 'John2@mail.com', _id: '4567321bf8b78fd1a0bb33c6768', ruolo: 'operatore_comunale'},
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
        const res = await request(app)
        .post('/api/v1/feedbacks/'+id_evento)
        .set('x-access-token', tokenCittadino)
        .send({
            rating: '5',
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

        test('Azione non permessa', async () => {
            const id_evento = '67321b91b78fd1a0bb33c674'
            const res = await request(app)
            .get('/api/v1/feedbacks/'+id_evento)
            .set('x-access-token', tokenCittadino);
            expect(res.status).toBe(403);
            expect(res.body.error).toBe('Utente non autorizzato');
        });

        test('Evento non trovato', async () => {
            const id_evento = '67321b91b78fd1a0bb33c600'
            const res = await request(app)
            .get('/api/v1/feedbacks/'+id_evento)
            .set('x-access-token', tokenComune);
            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Evento non trovato');
        });
        
    });  
    
afterAll( () => {
    mongoose.connection.close(true); 
});