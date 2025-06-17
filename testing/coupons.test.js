const request  = require('supertest');    
const app      = require('../app/app');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Coupon = require('../app/models/coupon.js');
require('dotenv').config();


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
let tokenAzienda = jwt.sign( 
    {email: 'John3@mail.com', _id: '67321bf8b78fd1a0bb33c679', ruolo: 'azienda'},
    process.env.JWT_SECRET, 
    {expiresIn: 43200} 
);

// Test per POST /coupons
describe('POST /coupons', () => {
  beforeAll( async () => {
    jest.setTimeout(8000);
    app.locals.db = await  mongoose.connect(process.env.DB_URL); 
  });

  test('dovrebbe creare un coupon con successo (201)', async () => {

    const res = await request(app)
      .post('/api/v1/coupons')
      .set('x-access-token', tokenAzienda)
      .send({
            descrizione_coupon: 'Coupon di prova',
            sconto_offerto: 20.0
      });

    expect(res.status).toBe(201);
  });

  test('Proposta fallita per dati mamcanti', async () => {
    const res = await request(app)
    .post('/api/v1/coupons')
    .set('x-access-token', tokenAzienda)
      .send({ 
        descrizione_coupon: '' ,  // Dato mancante
        sconto_offerto: 20.0
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
        sconto_offerto: 20.0
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
        approvato: true,
        punti: 100,
      });
    expect(res.status).toBe(200);
  });

  test('Coupon non ritrovato', async () => {
    const res = await request(app)
      .put('/api/v1/coupons/'+'6781868e62905e7412640d06')
      .set('x-access-token', tokenComune)
      .send({
        approvato: true,
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
        approvato: true,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Richiesta non valida: dati mancanti o non validi');
  });

  test('Azione non permessa a chi non è azienda', async () => {
    const id_coupon = '677f881c8d6061b10a434280';
    const res = await request(app)
    .delete('/api/v1/coupons/'+id_coupon)
    .set('x-access-token', tokenCittadino)
    .send({
      approvato: true,
      punti: 100,
    });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Azione non permessa');
  })
});

// Test per DELETE /coupons/:id_coupon
describe('DELETE /coupons/:{id_coupon}', () => {
  
  test('Azione non permessa a chi non è azienda', async () => {
    const id_coupon = '677f881c8d6061b10a434280';
    const res = await request(app)
    .delete('/api/v1/coupons/'+id_coupon)
    .set('x-access-token', tokenCittadino);

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Azione non permessa');
  })

  // Questo test, dato che elimina il coupon con successo, necessita di mettere un id_coupon nuovo valido ogni volta
  test('Cancellazione di un coupon con successo', async () => {
    const coupon = await Coupon.insertOne({
      descrizione_coupon: 'Coupon da eliminare',
      sconto_offerto: 10.0,
      approvato: false,
      punti: 0
    });
    await coupon.save(); // Salva il coupon nel database
    const id_coupon = coupon._id.toString(); // Converti l'ObjectId in stringa
    const res = await request(app)
      .delete('/api/v1/coupons/'+id_coupon)
      .set('x-access-token', tokenAzienda);

    expect(res.status).toBe(204);
  });

  test('Coupon non trovato', async () => {
    const id_coupon = '677f829c17deac078212f84b'; // Coupon inesistente
    const res = await request(app)
    .delete('/api/v1/coupons/'+id_coupon)
    .set('x-access-token', tokenAzienda);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Coupon non trovato');
  });
});

afterAll( () => {
    mongoose.connection.close(true); 
});