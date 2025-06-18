const request  = require('supertest');    
const app      = require('../app/app.js');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Azienda = require('../app/models/azienda.js');
require('dotenv').config();


let tokenAzienda = jwt.sign( 
  {email: 'azienda@mail.com', _id: '68527da629e0851f7f8c39c6', ruolo: 'azienda'},
  process.env.JWT_SECRET, 
  {expiresIn: 43200} 
);


describe('GET /api/v1/aziende', () => {
  beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });

    // Area personale
  test('GET /api/v1/aziende area personale', () => {
    return request(app).get('/api/v1/aziende')
    .set('x-access-token', tokenAzienda)
    .expect(200);
  });
});


describe('POST /api/v1/aziende', () => {
    beforeAll( async () => {
      jest.setTimeout(10000);
      app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });
    
    test('Registrazione non valida per dati mancanti', async () => {
        const res = await request(app)
        .post('/api/v1/aziende')
        .set('x-access-token', tokenAzienda)
        .send({
            nome_azienda: 'Azienda',
            partita_IVA: '',    // Dato mancante
            email: 'azienda@mail.com',
        });
        expect(res.status).toBe(400);
    });

    test('Registrazione avvenuta con successo', async () => {
        const res = await request(app)
        .post('/api/v1/aziende')
        .set('x-access-token', tokenAzienda)
        .send({
            nome: 'AziendaProva',
            partita_IVA: '12345678912',
            email: 'aziendaProva@mail.com',
            password: 'password123',
        });
        expect(res.status).toBe(201);
        expect(res.headers.location).toBe('/api/v1/aziende');
        // verifica che il nuovo evento sia stato salvato nel DB
        const azienda = await Azienda.findOne({partita_IVA: '12345678911'});
        expect(azienda).toBeDefined();
        expect(azienda.partita_IVA).toBe('12345678911');
    });
});

describe('PUT /api/v1/aziende', () => {
  beforeAll( async () => {
    jest.setTimeout(10000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });

  test('Modifica dei dati avvenuta con successo', async () => {
    const res = await request(app)
      .put('/api/v1/aziende')
      .set('x-access-token', tokenAzienda)
      .send({
          nome_azienda: 'nuovoNome',
      });

    expect(res.status).toBe(200);
  });

  test('Modifica non valida per dati mancanti', async () => {
    const res = await request(app)
      .put('/api/v1/aziende')
      .set('x-access-token', tokenAzienda)
      .send({
          // Dati mancanti
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: 'Nessun dato da aggiornare',
    });
  });

});


afterAll( () => {
    mongoose.connection.close(true); 
});