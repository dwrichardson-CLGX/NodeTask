const mongoose= require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'I need your name!'],
        trim: true
    },
    email: {
        unique: true,
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}
userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({_id: user._id},
            'mysecretismyown',
            {expiresIn: '7 days'});

    user.tokens = user.tokens.concat({ token: token })
    await user.save();

    return token;
}
userSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({ email })
    if(!user){
        throw  new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login');
    }

    return user;
}
//Hash the plain text password before saving
userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password'))
    {
        const hashedPassword =  await bcrypt.hash(user.password,8);
        console.log(hashedPassword);
        user.password = hashedPassword;
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
