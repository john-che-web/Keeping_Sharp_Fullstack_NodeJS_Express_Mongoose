const request = require('supertest');
const expressApp = require('../server');


let token;

describe('Users API', () => {

    // 1️⃣ Register a user first
    it('should register a new user', async () => {
        const res = await request(expressApp)
            .post('/users/register')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123'
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');

        token = res.body.token;   // Store token
        userId = res.body.user?._id || res.body._id; // depends on your response format
    });

    // 2️⃣ Duplicate email
    it('should reject duplicate emails', async () => {
        const res = await request(expressApp)
            .post('/users/register')
            .send({
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'john@example.com', // duplicate
                password: 'password123'
            });

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/already in use/i);
    });

    // 3️⃣ Invalid email
    it('should reject invalid email format', async () => {
        const res = await request(expressApp)
            .post('/users/register')
            .send({
                firstName: 'Test',
                lastName: 'User',
                email: 'invalid-email',
                password: 'password123'
            });

        expect(res.status).toBe(400);
    });

    // 4️⃣ Login to get a fresh token
    it('should login successfully', async () => {
        const res = await request(expressApp)
            .post('/users/login')
            .send({
                email: 'john@example.com',
                password: 'password123'
            });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();

        token = res.body.token; // Overwrite stored token
    });

    // 5️⃣ Get all users
    it('should retrieve all users', async () => {
        const res = await request(expressApp)
            .get('/users/all');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.users)).toBe(true);
    });

    // 6️⃣ Get user by ID
    it('should retrieve user by ID', async () => {
        const res = await request(expressApp)
            .get('/users/user')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body._id || res.body.user?._id).toBeDefined();
    });

    // 7️⃣ Update user info
    it('should update user info', async () => {
        const res = await request(expressApp)
            .patch('/users/change_name')
            .set('Authorization', `Bearer ${token}`)
            .send({
                firstName: 'Updated',
                lastName: 'Name'
            });

        expect(res.status).toBe(200);
        expect(res.body.user.firstName).toBe('Updated');
    });

    // 8️⃣ Delete the user
    it('should delete a user', async () => {
        const res = await request(expressApp)
            .delete('/users/delete_user')
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(200);
    });

});
