const request  = require('supertest');    
const app      = require('../app/app.js');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Cittadino = require('../app/models/cittadino.js');
require('dotenv').config();


describe('GET /api/v1/cittadini', () => {
  beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });

  let tokenCittadino = jwt.sign( 
    {email: 'mario.rossi@mail.com', _id: '68517c050ff8eec58f8226ec', ruolo: 'cittadino'},
    process.env.JWT_SECRET, 
    {expiresIn: 43200} 
  );

    // Area personale
  test('GET /api/v1/cittadini area personale', () => {
    return request(app).get('/api/v1/cittadini')
    .set('x-access-token', tokenCittadino)
    .expect(200);
  });
});


describe('POST /api/v1/cittadini', () => {
    beforeAll( async () => {
      jest.setTimeout(10000);
      app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });

    let tokenCittadino = jwt.sign( 
        {email: 'mario.rossi@mail.com', _id: '67321bf8b78fd1a0bb33c677', ruolo: 'cittadino'},
        process.env.JWT_SECRET, 
        {expiresIn: 43200} 
    );
    
    test('Registrazione non valida per dati mancanti', async () => {
        const res = await request(app)
        .post('/api/v1/cittadini')
        .send({
            nome: 'Mario',
            cognome: '',  // Dato mancante
            email: 'mario.rossi@mail.com',
            codice_fiscale: 'MRRS53JHDB7636T',
            username: 'mario_rossi',
            password: 'PasswordDiMario123F'
        });
        expect(res.status).toBe(400);
    });

    test('Registrazione avvenuta con successo', async () => {
        const res = await request(app)
        .post('/api/v1/cittadini')
        .set('x-access-token', tokenCittadino)
        .send({
            nome: 'Mario',
            cognome: 'Rossi',
            email: 'mario.rossi@mail.com',
            codice_fiscale: 'MRRS53JHDB7636T',
            username: 'mario_rossi',
            password: 'PasswordDiMario123F'
        });
        expect(res.status).toBe(201);
        expect(res.headers.location).toBe('/api/v1/cittadini');
        // verifica che il nuovo evento sia stato salvato nel DB
        const cittadino = await Cittadino.findOne({codice_fiscale: 'MRRS53JHDB7636T'});
        expect(cittadino).toBeDefined();
        expect(cittadino.codice_fiscale).toBe('MRRS53JHDB7636T');
    });
});

describe('PUT /api/v1/cittadini', () => {
  beforeAll( async () => {
    jest.setTimeout(10000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });

  let tokenCittadino = jwt.sign( 
      {email: 'mario.rossi@mail.com', _id: '68517c050ff8eec58f8226ec', ruolo: 'cittadino'},
      process.env.JWT_SECRET, 
      {expiresIn: 43200} 
  );

  test('Modifica dei dati avvenuta con successo', async () => {
    const res = await request(app)
      .put('/api/v1/cittadini')
      .set('x-access-token', tokenCittadino)
      .send({
          nome_cittadino: 'nuovoNome',
      });
    expect(res.status).toBe(200);
  });

  test('Modifica non valida per dati mancanti', async () => {
    const res = await request(app)
      .put('/api/v1/cittadini')
      .set('x-access-token', tokenCittadino)
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