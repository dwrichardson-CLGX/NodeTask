require('../src/db/mongoose');
const User = require('../src/models/user');

//60c7b3fb07d1bb774135db5c
User.findByIdAndUpdate('60c7b3fb07d1bb774135db5c',
    {age: 37}).then((user) => {
        console.log(user);
        return User.countDocuments({age: 37});
}).then((users) => {
    console.log(users);
}).catch(err => {
    console.log(err);
})
