const request  = require('supertest');    
const app      = require('../app/app');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Coupon = require('../app/models/coupon.js');
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

// Test per POST /coupons
describe('POST /coupons', () => {
  beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });

  test('Creazione del coupon con successo (201)', async () => {

    const res = await request(app)
      .post('/api/v1/coupons')
      .set('x-access-token', tokenAzienda)
      .send({
            descrizione_coupon: 'Coupon di prova',
      });

    expect(res.status).toBe(201);
  });

  test('Proposta fallita per dati mamcanti', async () => {
    const res = await request(app)
    .post('/api/v1/coupons')
    .set('x-access-token', tokenAzienda)
      .send({ 
        descrizione_coupon: '' ,  // Dato mancante
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Dati mancanti o non validi');
  });

  test('Proposta coupon negata per utente non azienda', async () => {
    const res = await request(app)
    .post('/api/v1/coupons')
    .set('x-access-token', tokenCittadino)
      .send({ 
        descrizione_coupon: 'Coupon di prova',
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Azione non permessa: la tipologia di utente non permette la proposta di un coupon');
  });
});

// Test per GET /coupons
describe('GET /coupons', () => {
  beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });
  
  test('Restituisce una lista di coupon', async () => {
    const res = await request(app)
    .get('/api/v1/coupons')
    .set('x-access-token', tokenComune);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

// Test per PUT /coupons/:id_coupon
describe('PUT /coupons/:{id_coupon}', () => {
  beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });
  
  test('Approvazione e assegnazione dei punti al coupon avvenuta con successo', async () => {

    const id_coupon = '685023d911e59d57f73961f4';
    
    const res = await request(app)
      .put('/api/v1/coupons/'+id_coupon)
      .set('x-access-token', tokenComune)
      .send({
        punti: 100,
      });
    expect(res.status).toBe(200);
  });

  test('Coupon non ritrovato', async () => {
    const res = await request(app)
      .put('/api/v1/coupons/'+'6781868e62905e7412640d06')
      .set('x-access-token', tokenComune)
      .send({
        punti: 100,
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Coupon non trovato');
  });

  test('Dati non validi', async () => {
    const id_coupon = '685023d911e59d57f73961f4';
    const res = await request(app)
      .put('/api/v1/coupons/'+id_coupon)
      .set('x-access-token', tokenComune)
      .send({
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Richiesta non valida: dati mancanti o non validi');
  });
});


afterAll( () => {
    mongoose.connection.close(true); 
});