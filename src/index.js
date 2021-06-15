const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

//POST to create a new task
app.post('/users',(req,res) => {
    //console.log(req.body);
    const newUser = new User(req.body);
    newUser.save().then(() => {
        res.status(201).send(newUser);
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.post('/tasks', (req,res) => {
    const newTask = new Task(req.body);
    newTask.save().then(() => {
        res.status(201).send(newTask);
    }).catch(err => {
        res.status(400).send(err);
    });
});

app.get('/users',(req,res)=>{
    User.find({}).then((docs) => {
        res.status(200).send(docs);
    }).catch((err)=> {
        res.status(500).send(err);
    })
});
app.get('/users/:id', (req,res) => {
    const _id = req.params.id;
    User.findById(_id).then((user) => {
        if(!user){
            return res.status(404).send();
        }
        else{
            return  res.status(200).send(user);
        }
    }).catch((error) => {
        res.status(500).send(error);
    })

});

app.get('/Tasks', (req,res) => {
    Task.find({}).then((docs) => {
        if(docs) {
            res.status(200).send(docs);
        }
        else{
            res.status(404).send('No tasks were found');
        }
    }).catch((error) => {
        res.status(500).send(error);
    })
});

app.get('/Tasks/:id', (req,res) => {
   const _id = req.params.id;

    Task.findById(_id).then((doc) => {
        if(doc){
            res.status(200).send(doc);
        }
        else{
            res.status(404).send('No task exists with provided id');
        }
    }).catch((err) => {
        res.status(500).send(err);
    })
})

app.listen(port,() =>{
    console.log('Server is up on port ', port);
})
