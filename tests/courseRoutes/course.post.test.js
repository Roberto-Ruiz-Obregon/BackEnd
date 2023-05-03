const request = require('supertest');
const app = require('../../app');
const {
    connectDB,
    dropDB,
    dropCollections,
} = require('../config/databaseTest');
const { createUser, createAdmin } = require('../config/dataBaseTestSetUp');
const { loginAdmin, loginUser } = require('../config/authSetUp');

const agent = request.agent(app);

beforeAll(async () => {
    await connectDB();
    await createAdmin();
    // Will set header to allow access to protected and restricted routes
    await loginAdmin(agent, 'dummy_admin@gmail.com', 'contra123');
});

afterAll(async () => {
    await dropCollections();
    await dropDB();
});

describe('Course post', () => {
    describe('Successful POST /v1/course', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/course').send({
                courseName: 'Pruebas de backend',
                description: 'esto es una prueba de testing',
                postalCode: '76060',
                teacher: 'Denisse dOMINGUEZ',
                startDate: '2023-06-23',
                endDate: '2023-07-30',
                schedule: 'viernes 10am',
                modality: 'Presencial',
                status: 'Gratuito',
                imageUrl:
                    'https://www.bbva.com/wp-content/uploads/2017/08/bbva-balon-futbol-2017-08-11.jpg',
            });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toBeTruthy();
        });
    });
    describe('Error POST /v1/course due to missing courseName', () => {
        test('successful', async () => {
            const res = await agent.post('/v1/course').send({
                postalCode: '76000',
                imageUrl:
                    'https://www.google.com/search?q=futbol&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjAzN3B-bb-AhVLlWoFHQ2aDS8Q_AUoAXoECAIQAw&biw=1536&bih=810&dpr=1.25',
            });
            expect(res.statusCode).toEqual(400);
            expect(res.body).toBeTruthy();
        });
    });
});
