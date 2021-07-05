const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');


const userOneId = new mongoose.Types.ObjectId();
const userTwoId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@example.com',
    password: '56what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_KEY)
    }]
};


const userTwo = {
    _id: userTwoId,
    name: 'Dwain',
    email: 'dwr@example.com',
    password: '57what!!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_KEY)
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test task one',
    completed: false,
    owner: userOne._id
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test task two',
    completed: true,
    owner: userTwo._id
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test task 3',
    completed: true,
    owner: userTwo._id
}


const initializeDatabase = async () => {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();

    await Task.deleteMany();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}
module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskTwo,
    taskThree,
    taskOne,
    initializeDatabase
}
