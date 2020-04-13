const request = require('supertest')
const app = require('../src/app')
const User = require('../src/db/models/user')
const { userOne, userOneId, setUpDatabase } = require('./fixtures/db')

beforeEach(setUpDatabase)

// First test case
test('Should sign up new user', async () => {
    const response = await request(app).post('/users').send({
        name: "Zaheed Beita",
        username: "lordzeddy",
        password: "MyParss!!",
        email: "lordzeddy31@gmail.com"
    }).expect(201)

    // Assert that the database was changed correctly
    user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    
    // Assertions about response
    expect(response.body).toMatchObject({
        user: {
            name: "Zaheed Beita",
            username: "lordzeddy",
            email: "lordzeddy31@gmail.com"
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('MyParss!!')
})

// Second test case
test('Should login user', async () => {
    const response = await request(app).post('/users/login').send({
        username: userOne.username,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)  
})

//  Should not login nonexistent user
test('should not login nonexistent user', async () => {
    const response = await request(app).post('/users/login').send({
        username: userOne.username,
        password: "dfejfnef"
    }).expect(400)
})

// Fourth Case
test('Should get user profile', async () => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

// Fifth case
test('Should not get unauthenticated user profile', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

// Sixth case
test('Should delete account for user', async () => {
    const response = await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()

})
// Seventh case
test('Should not delete account for user', async () => {
    await request(app).delete('/users/me')
        .send()
        .expect(401)
})

test('Should update valid user field', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Mamman'
        })
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Mamman')
}) 

test('Should not update invalid user field', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Mamman'
        })
        .expect(400)
    
}) 

