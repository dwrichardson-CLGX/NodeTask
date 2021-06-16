const express = require('express');
const router = new express.Router();
require('../db/mongoose');
const User = require('../models/user');
const auth = require('../middleware/authentication');


router.get('/users/me', auth, async (req,res)=>{
    // try {
    //     const users = await User.find({});
    //     res.status(200).send(users);
    // }
    // catch (e) {
    //     res.status(500).send(e);
    // }

    res.send(req.user);
    // User.find({}).then((docs) => {
    //     res.status(200).send(docs);
    // }).catch((err)=> {
    //     res.status(500).send(err);
    // })
});

router.get('/users/:id',auth, async (req,res) => {
    const _id = req.params.id;

    try{
        const user =  await User.findById(_id);
        if(!user)
        {
            res.status(404).send();
        }
        else {
            res.status(200).send(user);
        }
    }
    catch (e) {
        res.status(500).send(e);
    }

    // User.findById(_id).then((user) => {
    //     if(!user){
    //         return res.status(404).send();
    //     }
    //     else{
    //         return  res.status(200).send(user);
    //     }
    // }).catch((error) => {
    //     res.status(500).send(error);
    // })

});

router.post('/users',async (req,res) => {

    const newUser = new User(req.body);
    try{
        await newUser.save();
        const token = await newUser.generateAuthToken();
        res.status(201).send({newUser, token});
    }
    catch (e) {
        res.status(400).send(e);
    }

    // newUser.save().then(() => {
    //     res.status(201).send(newUser);
    // }).catch((error) => {
    //     res.status(400).send(error);
    // });
});
router.post('/users/login', async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();

        res.send({user, token});

    }
    catch (e) {
        res.status(400).send(e)
    }
})
router.post('/users/logout', auth, async(req,res)=>{
    try{
        const user = req.user;
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })

        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send(e)
    }
});
router.post('/users/logoutAll', auth, async(req,res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send({error: 'Error Logging out'})
    }
})


router.patch('/users/me',auth, async(req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates  = ['age','name','email','password'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if(!isValidOperation){
        return  res.status(400).send({error: 'Invalid updates'});
    }

    try{
        // const _id = req.params.id;
        //
        // const updatedUser = await User.findById(_id);

        updates.forEach((update) => {
           req.user[update] = req.body[update];
        });

        await req.user.save();
       // const updatedUser = await User.findByIdAndUpdate(_id, req.body, {new: true});
       //  if(!updatedUser)
       //  {
       //      return res.status(404).send('User does not exist');
       //  }
        res.send(req.user);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/users/me',auth, async(req, res) => {
    try{

        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user){
        //     return res.status(404).send();
        // }
        await req.user.remove();
        res.send(req.user);
    }
    catch (e) {

    }
});

module.exports = router;
