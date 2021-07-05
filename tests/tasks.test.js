const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/task');
const { taskOne, taskTwo, taskThree, userOne, userTwo, userOneId, initializeDatabase } = require('./fixtures/db');


beforeEach(initializeDatabase);
test('Should create task for user one', async() => {
   const response = await request(app)
       .post('/tasks')
       .set('Authorization',  `Bearer ${userOne.tokens[0].token}`)
       .send({
           description: 'Put kids to bed'
       })
       .expect(201);

   const task = await Task.findById(response.body._id);
   expect(task).not.toBe(null);
   expect(task.completed).toBe(false);
})

test('Should get all tasks for user one', async() => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(1);

})

// test('Should not allow user two to delete user one task', async() => {
//     console.log(taskOne._id);
//     const response = await request(app)
//         .delete(`/tasks/${taskOne._id}`)
//         .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
//         .send()
//         .expect(404);
//
// })

