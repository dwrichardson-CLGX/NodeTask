const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/authentication')
require('../db/mongoose');

router.post('/tasks',auth, (req,res) => {
   // const newTask = new Task(req.body);
   const newTask = new Task({
       ...req.body,
       owner: req.user._id
   });

    newTask.save().then(() => {
        res.status(201).send(newTask);
    }).catch(err => {
        res.status(400).send(err);
    });

});


//GET /tasks?completed
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc
router.get('/Tasks', auth, async (req,res) => {
    try{
        let filter = { owner: req.user._id};
        let sort = {};
        const isCompleted = req.query.completed;

        if(isCompleted !== undefined){
            filter = { owner: req.user._id , completed : isCompleted };
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'asc' ? 1 : -1;
        }
        const tasks = await Task.find(filter)
            .setOptions({
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            });
        // await req.user.populate({
        //    path: 'tasks',
        //     match: filter,
        //     options: {
        //        limit: parseInt(req.query.limit),
        //        skip: parseInt(req.query.limit)
        //     }
        // }).execPopulate();
        // res.send(req.user.tasks);

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

router.get('/Tasks/:id',auth, async (req,res) => {


    try{
        const _id = req.params.id;
      //const task = await Task.findById(_id)
       const task = await Task.findOne({_id, owner: req.user._id });

       console.log(_id);
       console.log(req.user._id);
       console.log(task);
        if(task){
            res.status(200).send(task);
        }
        else{
            return res.status(404).send();
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

router.patch('/tasks/:id',auth, async (req,res) => {
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
       // const updatedTask = await Task.findById(_id);

        const updatedTask = await Task.findOne({_id, owner: req.user._id})
        if(!updatedTask)
        {
            return res.status(404).send('Task does not exist');
        }


        updates.forEach((update) =>{
            updatedTask[update] = req.body[update]
        });
        await updatedTask.save();

        res.send(updatedTask);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id',auth, async(req, res) => {
    try{
      //  const task = await Task.findByIdAndDelete(req.params.id)

        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }
    catch (e) {

    }
});

module.exports = router;
