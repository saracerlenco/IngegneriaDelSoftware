const request  = require('supertest');    
const app      = require('../app/app.js');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Cittadino = require('../app/models/cittadino.js');
require('dotenv').config({ path: './../.env' });


describe('POST /api/v1/sessions', () => {
    beforeAll( async () => {
        jest.setTimeout(10000);
        app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });
    
    test('Autenticazione avvenuta con successo', async () => {
        const res = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'mario.rossi@mail.com',
            password: 'PasswordDiMario123F',
            ruolo: 'cittadino',
        });

        expect(res.status).toBe(200);
    });

    test('Autenticazione fallita per credenziali non valide', async () => {
        const res = await request(app)
        .post('/api/v1/sessions')
        .send({
            email: 'mario.rossi@mail.com',
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
        {email: 'mario.rossi@mail.com', _id: '67321bf8b78fd1a0bb33c677', ruolo: 'cittadino'},
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
        .set('x-access-token', '948y5irubci73y4bocr8wcbq');

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error', 'Token non valido');
    });

    test('Token mancante', async () => {
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