const mongoose= require('mongoose');
const validator = require('validator');

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

module.exports = User;
