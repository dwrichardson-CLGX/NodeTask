const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
require('../db/mongoose');

router.post('/tasks', (req,res) => {
    const newTask = new Task(req.body);
    newTask.save().then(() => {
        res.status(201).send(newTask);
    }).catch(err => {
        res.status(400).send(err);
    });
});

router.get('/Tasks', async (req,res) => {
    try{
        const tasks = await Task.find({});
        if(tasks) {
            res.status(200).send(tasks);
        }
        else{
            return res.status(404).send('No tasks were found');
        }

    }catch (e) {
        res.status(500).send(e);
    }

    // Task.find({}).then((docs) => {
    //     if(docs) {
    //         res.status(200).send(docs);
    //     }
    //     else{
    //         res.status(404).send('No tasks were found');
    //     }
    // }).catch((error) => {
    //     res.status(500).send(error);
    // })
});

router.get('/Tasks/:id', async (req,res) => {


    try{
        const _id = req.params.id;
        const task = await Task.findById(_id)
        if(task){
            res.status(200).send(task);
        }
        else{
            return res.status(404).send('No tasks exist');
        }
    }
    catch (e) {
        res.status(500).send(e);
    }

    // Task.findById(_id).then((doc) => {
    //     if(doc){
    //         res.status(200).send(doc);
    //     }
    //     else{
    //         res.status(404).send('No task exists with provided id');
    //     }
    // }).catch((err) => {
    //     res.status(500).send(err);
    // })
})

router.patch('/tasks/:id', async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates  =  ['completed','description'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if(!isValidOperation){
        return  res.status(400).send({error: 'Invalid updates'});
    }

    try{
        const _id = req.params.id;
        const incomingTask = new Task(req.body);
        const updatedTask= await Task.findByIdAndUpdate(_id, req.body, {new: true});
        if(!updatedTask)
        {
            return res.status(404).send('Task does not exist');
        }

        res.send(updatedTask);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', async(req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }
    catch (e) {

    }
});

module.exports = router;
