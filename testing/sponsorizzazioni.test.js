const request  = require('supertest');    
const app      = require('../app/app');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
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


describe('POST /api/v1/sponsorizzazioni/{id_evento}', () => {
beforeAll( async () => {
jest.setTimeout(10000);
app.locals.db = await  mongoose.connect(process.env.DB_URL); });

test('POST /api/v1/sponsorizzazioni/{id_evento}', async () => {
    const id_evento = '67321b91b78fd1a0bb33c674'
    const res = await request(app)
    .post('/api/v1/sponsorizzazioni/'+id_evento)
    .set('x-access-token', tokenAzienda);
    expect(res.status).toBe(201);
});


test('POST /api/v1/sponsorizzazioni', async () => {
    const id_evento = '67321b91b78fd1a0bb33c674'
    const res = await request(app)
    .post('/api/v1/sponsorizzazioni/'+id_evento)
    .set('x-access-token', tokenCittadino);
    expect(res.status).toBe(403);
});

test('POST /api/v1/sponsorizzazioni', async () => {
    const id_evento = '67321b91b78fd1a0bb33c174'    // Evento inesistente
    const res = await request(app)
    .post('/api/v1/sponsorizzazioni/'+id_evento)
    .set('x-access-token', tokenAzienda);
    expect(res.status).toBe(404);
});

});

describe('GET /api/v1/sponsorizzazioni', () => {
beforeAll( async () => {
    jest.setTimeout(10000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); });
    
    test('GET /api/v1/sponsorizzazioni', async () => {
        const res = await request(app)
        .get('/api/v1/sponsorizzazioni')
        .set('x-access-token', tokenAzienda);
        expect(res.status).toBe(200);
    });
    
    test('GET /api/v1/sponsorizzazioni', async () => {
        const res = await request(app)
        .get('/api/v1/sponsorizzazioni')
        .set('x-access-token', tokenCittadino);
        expect(res.status).toBe(403);
    });
    
});  

describe('DELETE /sponsorizzazioni/{id_evento}', () => {
    beforeAll( async () => {
        jest.setTimeout(10000);
        app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });
    
    test('Sponsorizzazione eliminata con successo', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674';
        const res = await request(app)
        .delete('/api/v1/sponsorizzazioni/'+id_evento)
        .set('x-access-token', tokenAzienda);
        
        expect(res.status).toBe(204);
    });
    
    test('Evento inesistente', async () => {
        const id_evento = '67321b91b78fd1a0bb33a674';
        const res = await request(app)
        .delete('/api/v1/sponsorizzazioni/'+id_evento)
        .set('x-access-token', tokenAzienda);
        
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Evento inesistente');
    });
    
    test('Utente non autorizzato', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674';
        const res = await request(app)
        .delete('/api/v1/sponsorizzazioni/'+id_evento)
        .set('x-access-token', tokenCittadino);
        
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty('error', 'Utente non autorizzato');
    });
});


afterAll( () => {
    mongoose.connection.close(true); 
});