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
let tokenComune = jwt.sign( 
  {email: 'mario.rossi@mail.com', _id: '68527da098e8fce64da5ea56', ruolo: 'operatore_comunale'},
  process.env.JWT_SECRET, 
  {expiresIn: 43200} 
);


describe('POST /api/v1/partecipazioni/:id_evento', () => {
    beforeAll( async () => {
        jest.setTimeout(10000);
        app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });

    
    test('Partecipazione registrata con successo', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674'
        const res = await request(app)
        .post('/api/v1/partecipazioni/'+id_evento)
        .set('x-access-token', tokenCittadino)
        .send()
        expect(res.status).toBe(201);
    });
    
    test('Dati mancanti', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674'
        const res = await request(app)
        .post('/api/v1/partecipazioni/'+id_evento)
        .set('x-access-token', tokenCittadino);
        expect(res.status).toBe(201);
    })
    
    test('Richiesta non valida', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674'
        const res = await request(app)
        .post('/api/v1/partecipazioni/'+id_evento)
        .set('x-access-token', tokenComune);
        expect(res.status).toBe(403);
    });
    
    test('Evento non presente', async () => {
        const id_evento = '67321b91b78fd1a0bb33c600'
        const res = await request(app)
        .post('/api/v1/partecipazioni/'+id_evento)
        .set('x-access-token', tokenCittadino);
        expect(res.status).toBe(404);
    });
    
});

describe('GET /api/v1/partecipazioni', () => {
    beforeAll( async () => {
        jest.setTimeout(8000);
        app.locals.db = await  mongoose.connect(process.env.DB_URL); });
        
        
        test('GET /api/v1/partecipazioni', async () => {
            const res = await request(app)
            .get('/api/v1/partecipazioni')
            .set('x-access-token', tokenCittadino);
            expect(res.status).toBe(200);
        });
        
        test('GET /api/v1/partecipazioni', async () => {
            const res = await request(app)
            .get('/api/v1/partecipazioni')
            .set('x-access-token', tokenComune);
            expect(res.status).toBe(403);
        });
        
    });  
    
    describe('DELETE /partecipazioni/{id_evento}', () => {
        beforeAll( async () => {
            jest.setTimeout(10000);
            app.locals.db = await  mongoose.connect(process.env.DB_URL); 
        });
        
        // Per eseguire questo test bisogna mettere l'id di un evento per cui il cittadino ha segnato la sua partecipazione
        // test('Partecipazione eliminata con successo', async () => {
        //     const id_evento = '67321b91b78fd1a0bb33c674';
        //     const res = await request(app)
        //     .delete('/api/v1/partecipazioni/'+id_evento)
        //     .set('x-access-token', tokenCittadino);

        //     expect(res.status).toBe(204);
        // });
        
        test('Evento inesistente', async () => {
            const id_evento = '67321b91b78fd1a0bb33a674';
            const res = await request(app)
            .delete('/api/v1/partecipazioni/'+id_evento)
            .set('x-access-token', tokenCittadino);
        
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty('error', 'Evento inesistente');
        });
        
        test('Utente non autorizzato', async () => {
            const id_evento = '67321b91b78fd1a0bb33c674';
            const res = await request(app)
              .delete('/api/v1/partecipazioni/'+id_evento)
              .set('x-access-token', tokenComune);
        
            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('error', 'Utente non autorizzato');
          });
    });
    
    afterAll( () => {
        mongoose.connection.close(true); 
    });