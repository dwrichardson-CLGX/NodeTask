const mongoose = require('mongoose');
const validator = require('validator');
const uri = "mongodb+srv://dwain:dwain@dwainmongo.6kmb3.mongodb.net/Tasks?retryWrites=true&w=majority";

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const Task = mongoose.model('Task',{
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }});
const User = mongoose.model('User', {
    name: {
        type: String,
        required: [true, 'I need your name!'],
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is not valid')
            }
        }
    },
    age: {
        type: Number,
        default: 1,
        validate(value) {
            if (value < 1) {
                throw new Error('Age must be greater than 0')
            }
        }
    },
    password:{
        type: String,
        required: true,
        minLength: 7,
        validate(value){
            if(value.includes('password')){
                throw new Error('Password field cannot contain the word password')
            }

        }
    }
});

const me = new User({
    name: ' Tiffany  ',
    email: 'Tiffany@hotmail.com',
    age: 30,
    password:'abc123'
});

// const task = new Task({
//     description: 'Learn Something',
//     completed: true
// });
//
// task.save().then(() => {
//     console.log(task);
// }).catch((error) => {
//     console.log(error)
// })

 me.save().then(() => {
     console.log(me);
 }).catch((error) => {
     console.log('Error', error);
 }).finally(() => {
     mongoose.disconnect();
 });


 // wde@gotofirst.com
