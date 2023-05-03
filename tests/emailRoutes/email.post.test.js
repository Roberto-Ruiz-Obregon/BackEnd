const request = require('supertest');
const app = require('../../app');
const {
    connectDB,
    dropDB,
    dropCollections,
} = require('../config/databaseTest');
const { createUser, createAdmin } = require('../config/dataBaseTestSetUp');
const { loginAdmin } = require('../config/authSetUp');

const agent = request.agent(app);

beforeAll(async () => {
    await connectDB();
    await createAdmin();
    await createUser();
    // Da acceso a las rutas protegidas y restringidas
    await loginAdmin(agent, 'dummy_admin@gmail.com', 'contra123');
});

afterAll(async () => {
    await dropCollections();
    await dropDB();
});

describe('Program gets APIFeatures', () => {
    describe('Successful POST /v1/emails/emailToEveryone', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/emails/emailToEveryone').send({
                message: 'Este es un correo de prueba',
                imageUrl:
                    'https://www.bbva.com/wp-content/uploads/2017/08/bbva-balon-futbol-2017-08-11.jpg',
                subject: 'Prueba de correo',
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toBeTruthy();
        });
    });
});
