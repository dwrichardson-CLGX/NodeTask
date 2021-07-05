const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOne, userOneId, initializeDatabase } = require('./fixtures/db');

beforeEach(initializeDatabase);

// afterEach(() => {
   // console.log('after Each')
// });
test('Should signup a new user', async() => {
    const response = await request(app).post('/users').send({
        name:'Dwain',
        email: 'dwain.richardson@gmail.com',
        password: 'MyPass123!'
    }).expect(201);

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.newUser._id);
    expect(user).not.toBeNull();

    //Assertions about the response
    //expect(response.body.newUser.name).
    expect(response.body).toMatchObject({
        newUser: {
            name: 'Dwain',
            email: 'dwain.richardson@gmail.com'
        },
        token: user.tokens[0].token
    })
})

test('Should login existing user', async() => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(response.body.user._id);
   // console.log(user);
    expect(response.body.token).toBe(user.tokens[1].token);

})

test('Should not login nonexistent user', async() => {
    await request(app).post('/users/login')
        .send({
                email:'nonexistent@example.com',
                password: 'password123'})
        .expect(400);
})


test('Should get user profile', async() => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token }`)
        .send()
        .expect(200);
})


test('should not get profile for unauthenticated user', async() => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
})


test('should delete profile for authenticated user', async() => {
  const response =  await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(user).toBeNull();

})

test('should not delete profile for unauthenticated user', async() => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
})

test('Should upload avatar image', async() => {
   const response = await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200);
   const user = await User.findById(userOneId);
   expect(user.avatar).toEqual(expect.any(Buffer));

})

test('Should update users profile', async() => {

    var newUser = {
        name: 'Andrew'
    }
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send(newUser)
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toEqual('Andrew');
})


test('Should not update users profile', async() => {

    var newUser = {
        name: 'Andrew',
        address: 'Office Park'
    }
    const response = await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send(newUser)
        .expect(400);

})
