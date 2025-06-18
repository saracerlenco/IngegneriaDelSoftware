const request  = require('supertest');    
const app      = require('../app/app.js');
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

describe('GET /coupons_cittadino', () => {
  beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });
  
  test('Restituisce una lista di coupon', async () => {
    const res = await request(app)
    .get('/api/v1/coupons_cittadino')
    .set('x-access-token', tokenCittadino);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  
  test('Azione non permessa a chi non è un cittadino', async () => {
    const res = await request(app)
    .get('/api/v1/coupons_cittadino')
    .set('x-access-token', tokenComune);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Azione non permessa');
  })
});

describe('POST /coupons', () => {
  beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });

  test('Aggiunta coupon alla lista dei coupon del cittadino', async () => {
    const id_coupon = '685023d911e59d57f73961f4';
    const res = await request(app)
    .post('/api/v1/coupons_cittadino/'+id_coupon)
    .set('x-access-token', tokenCittadino);

    expect(res.status).toBe(201);
  });

  test('Utente non autorizzato', async () => {
    const id_coupon = '685023d911e59d57f73961f4';
    const res = await request(app)
    .post('/api/v1/coupons_cittadino/'+id_coupon)
    .set('x-access-token', tokenComune);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Azione non permessa');
  });

  test('Aggiunta coupon alla lista dei coupon del cittadino', async () => {
    const id_coupon = '6781768e62905e7412540d06'; // id_coupon inesistente
    const res = await request(app)
    .post('/api/v1/coupons_cittadino/'+id_coupon)
    .set('x-access-token', tokenCittadino);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Coupon non trovato');
  });
});


afterAll( () => {
    mongoose.connection.close(true); 
});