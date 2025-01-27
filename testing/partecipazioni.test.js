const request  = require('supertest');    
const app      = require('../app/app');
const jwt      = require('jsonwebtoken'); 
const mongoose = require('mongoose');
const Evento = require('../app/models/evento.js');
require('dotenv').config();

describe('POST /api/v1/partecipazioni/:id_evento', () => {
    beforeAll( async () => {
        jest.setTimeout(10000);
        app.locals.db = await  mongoose.connect(process.env.DB_URL); 
    });
    
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
    
    test('POST /api/v1/feedbacks/:id_evento', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674'
        const res = await request(app)
        .post('/api/v1/feedbacks/'+id_evento)
        .set('x-access-token', tokenCittadino)
        .send({
            messgae
        })
        expect(res.status).toBe(201);
    });
    
    test('Dati mancanti', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674'
        const res = await request(app)
        .post('/api/v1/feedbacks/'+id_evento)
        .set('x-access-token', tokenCittadino);
        expect(res.status).toBe(201);
    })
    
    test('POST /api/v1/feedbacks/:id_evento', async () => {
        const id_evento = '67321b91b78fd1a0bb33c674'
        const res = await request(app)
        .post('/api/v1/feedbacks/'+id_evento)
        .set('x-access-token', tokenComune);
        expect(res.status).toBe(403);
    });
    
    test('POST /api/v1/feedbacks/:id_evento', async () => {
        const id_evento = '67321b91b78fd1a0bb33c600'
        const res = await request(app)
        .post('/api/v1/feedbacks/'+id_evento)
        .set('x-access-token', tokenCittadino);
        expect(res.status).toBe(404);
    });
    
});

// describe('GET /api/v1/partecipazioni/:id_evento', () => {
    //     beforeAll( async () => {
        //       jest.setTimeout(8000);
//       app.locals.db = await  mongoose.connect(process.env.DB_URL); });

//       let tokenCittadino = jwt.sign( 
//           {email: 'John@mail.com', _id: '67321bf8b78fd1a0bb33c677', ruolo: 'cittadino'},
//           process.env.JWT_SECRET, 
//           {expiresIn: 43200} 
//       );
//       let tokenComune = jwt.sign( 
//               {email: 'John2@mail.com', _id: '4567321bf8b78fd1a0bb33c6768', ruolo: 'operatore_comunale'},
//               process.env.JWT_SECRET, 
//               {expiresIn: 43200} 
//           );

//       test('GET /api/v1/partecipazioni/:id_evento', async () => {
    //           const id_evento = '67321b91b78fd1a0bb33c674'
//           const res = await request(app)
//           .get('/api/v1/partecipazioni/'+id_evento)
//           .set('x-access-token', tokenComune);
//           expect(res.status).toBe(200);
//       });

//       test('GET /api/v1/partecipazioni/:id_evento', async () => {
    //           const id_evento = '67321b91b78fd1a0bb33c674'
//           const res = await request(app)
//           .get('/api/v1/partecipazioni/'+id_evento)
//           .set('x-access-token', tokenCittadino);
//           expect(res.status).toBe(403);
//       });

//       test('GET /api/v1/partecipazioni/:id_evento', async () => {
    //           const id_evento = '67321b91b78fd1a0bb33c600'
//           const res = await request(app)
//           .get('/api/v1/partecipazioni/'+id_evento)
//           .set('x-access-token', tokenComune);
//           expect(res.status).toBe(200);
//       });

//   });  

describe('GET /api/v1/partecipazioni', () => {
    beforeAll( async () => {
        jest.setTimeout(8000);
        app.locals.db = await  mongoose.connect(process.env.DB_URL); });
        
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
        let tokenCittadino = jwt.sign( 
            {email: 'mario.rossi@mail.com', _id: '67321bf8b78fd1a0bb33c677', ruolo: 'cittadino'},
            process.env.JWT_SECRET, 
            {expiresIn: 43200} 
        );
        let tokenComune = jwt.sign( 
            {email: 'John2@mail.com', _id: '4567321bf8b78fd1a0bb33c6768', ruolo: 'operatore_comunale'},
            process.env.JWT_SECRET, 
            {expiresIn: 43200} 
        );
        
        test('Partecipazione eliminata con successo', async () => {
            const id_evento = '67321b91b78fd1a0bb33c674';
            const res = await request(app)
            .delete('/api/v1/partecipazioni/'+id_evento)
            .set('x-access-token', tokenCittadino);

            expect(res.status).toBe(204);
        });
        
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