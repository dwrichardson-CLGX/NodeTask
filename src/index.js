const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const app = express();
console.log(process.env);
const port = process.env.PORT; // || 3000;
/*


const multer = require('multer');
const upload = multer({
    dest: 'images'
});
app.post('/upload', upload.single('upload') , (req,res) => {
    res.send();
})
*/


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
const jwt_key = process.env.JWT_KEY;
const myFunction = async() => {
const token =
    jwt.sign({_id: 'abc123'},
        `${jwt_key}`,
        {expiresIn: '7 days'});
console.log(token);
const data = jwt.verify(token,`${jwt_key}`)
console.log(data);

// const task = await Task.findById('60ca4eee2688bc96433bd448');
// await task.populate('owner').execPopulate();
// console.log(task.owner);
//
// const user = await User.findById('60ca4e1e8df3c1962fce6686');
// await user.populate('tasks').execPopulate();
//
// console.log(user.tasks);

}

myFunction();
