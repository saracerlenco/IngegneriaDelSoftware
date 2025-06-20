const request  = require('supertest');    
const app      = require('../app/app.js');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Operatore_Comunale = require('../app/models/operatore_comunale.js');
require('dotenv').config();

let tokenComune = jwt.sign( 
  {email: 'mario.rossi@mail.com', _id: '68527da098e8fce64da5ea56', ruolo: 'operatore_comunale'},
  process.env.JWT_SECRET, 
  {expiresIn: 43200} 
);


describe('GET /api/v1/operatori_comunali', () => {
  beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 

    await Operatore_Comunale.create({
      nome: 'Mario',
      cognome: 'Rossi',
      email: 'mario.rossi@mail.com'
    });
  });

    // Area personale
  test('GET /api/v1/operatori_comunali area personale', () => {
    return request(app).get('/api/v1/operatori_comunali')
    .set('x-access-token', tokenComune)
    .expect(200);
  });
});


describe('POST /api/v1/operatori_comunali', () => {
    beforeAll( async () => {
      jest.setTimeout(10000);
      app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });
    
    test('Registrazione non valida per dati mancanti', async () => {
        const res = await request(app)
        .post('/api/v1/operatori_comunali')
        .set('x-access-token', tokenComune)
        .send({
            nome: 'Mario',
            cognome: '',  // Dato mancante
            email: 'mario.rossi@mail.com',
            codice_fiscale: 'MRRS53JHDB7636T',
            username: 'mario_rossi',
        });
        expect(res.status).toBe(400);
    });

    test('Registrazione avvenuta con successo', async () => {
        const res = await request(app)
        .post('/api/v1/operatori_comunali')
        .set('x-access-token', tokenComune)
        .send({
            nome: 'NomeProva',
            cognome: 'CognomeProva',
            email: 'mailProva@mail.com',
            codice_fiscale: 'MRRS53JHDB7636P',
            username: 'username_prova',
            password: 'passwordProva',
        });
        expect(res.status).toBe(201);
        expect(res.headers.location).toBe('/api/v1/operatori_comunali');
        // verifica che il nuovo evento sia stato salvato nel DB
        const op = await Operatore_Comunale.findOne({codice_fiscale: 'MRRS53JHDB7636P'});
        expect(op).toBeDefined();
        expect(op.codice_fiscale).toBe('MRRS53JHDB7636P');
    });
});

describe('PUT /api/v1/operatori_comunali', () => {
  beforeAll( async () => {
    jest.setTimeout(10000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });

  test('Modifica dei dati avvenuta con successo', async () => {
    const res = await request(app)
      .put('/api/v1/operatori_comunali')
      .set('x-access-token', tokenComune)
      .send({
          cognome_operatore_comunale: 'nuovoCognome',
      });
      console.log(res.body);
    expect(res.status).toBe(200);
  });

  test('Modifica non valida per dati mancanti', async () => {
    const res = await request(app)
      .put('/api/v1/operatori_comunali')
      .set('x-access-token', tokenComune)
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