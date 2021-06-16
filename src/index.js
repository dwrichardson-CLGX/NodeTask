const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const app = express();
const port = process.env.PORT || 3000;

// app.use((req,res,next) => {
//    // console.log(req.method);
// /*    if(req.method === 'GET'){
//         res.send({error: 'Get methods are temporarily not allowed'})
//     }
//     else{
//         next();
//     }*/
//  //   console.log(req.path);
//
//    //next();
//
//     res.status(503).send({error: 'The site is currently undergoing maintenance'})
// });
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//POST to create a new task
app.listen(port,() =>{
    console.log('Server is up on port ', port);
})


const jwt = require('jsonwebtoken')
const myFunction = async() => {
const token =
    jwt.sign({_id: 'abc123'},
        'mysecretismyown',
        {expiresIn: '7 days'});
console.log(token);
const data = jwt.verify(token,'mysecretismyown')
console.log(data);
}

myFunction();
