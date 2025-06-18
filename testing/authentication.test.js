const request  = require('supertest');    
const app      = require('../app/app.js');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Cittadino = require('../app/models/cittadino.js');
require('dotenv').config();

describe('POST /api/v1/sessions', () => {
    beforeAll( async () => {
        jest.setTimeout(10000);
        app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });
    
    test('Autenticazione avvenuta con successo', async () => {
        const res = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'cittadino1@gmail.com',
            password: 'c1',
            ruolo: 'cittadino',
        });

        expect(res.status).toBe(200);
    });

    test('Autenticazione fallita per credenziali non valide', async () => {
        const res = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'cittadino1@gmail.com',
            password: 'password_sbagliata', // password sbagliata
            ruolo: 'cittadino',
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error', 'Credenziali non valide');
    });
    
    test('Autenticazione fallita per credenziali non valide', async () => {
        const res = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'pippo@gmail.com',   // email inesistente
            password: 'PasswordDiMario123F',
            ruolo: 'cittadino',
        });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error', 'Utente non trovato');
    });
});

describe('DELETE /sessions', () => {
    beforeAll( async () => {
        jest.setTimeout(10000);
        app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });
    let tokenCittadino = jwt.sign( 
        {email: 'cittadino1@gmail.com', _id: '67a4b1299e2a096416badee9', ruolo: 'cittadino'},
        process.env.JWT_SECRET, 
        {expiresIn: 43200} 
    );

    test('Logout avvenuto con successo', async () => {
      const res = await request(app)
        .delete('/api/v1/sessions')
        .set('x-access-token', tokenCittadino);

      expect(res.status).toBe(204);
    });

    test('Token non valido', async () => {
      const res = await request(app)
        .delete('/api/v1/sessions')
        .set('x-access-token', '67a4b1299e2a096426badee9');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token non valido');
    });

    test('Token non valido', async () => {
        const res = await request(app)
          .delete('/api/v1/sessions')
          .set('x-access-token', '');
  
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Token mancante');
      });
  });

afterAll( () => {
    mongoose.connection.close(true); 
});