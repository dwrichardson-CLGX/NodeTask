const express = require('express');
const multer = require('multer');
const router = new express.Router();
const sharp =  require('sharp')
require('../db/mongoose');
const User = require('../models/user');
const auth = require('../middleware/authentication');
const { sendWelcomeEmail, cancelAccountEmail } = require('../emails/account');

const upload = multer({
   // dest: 'avatars',
    limits : {
     fileSize: 1000000
    },
    fileFilter(req,file,cb){

        if(!file.originalname.match(/\.(jpeg|png|jpg)$/)){
            cb(new Error('Please upload an image file '));
        }
        else{
            cb(undefined,true);
        }
/*        cb(new Error('File Must be a PDF'))
        cb(undefined,true);
        cb(undefined,false);*/


    }
});

router.get('/users/me', auth, async (req,res)=>{
    // try {
    //     const users = await User.find({});
    //     res.status(200).send(users);
    // }
    // catch (e) {
    //     res.status(500).send(e);
    // }
   console.log('getting user profile');
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
        sendWelcomeEmail(newUser.email, newUser.name);
        const token = await newUser.generateAuthToken();
        res.status(201).send({newUser, token});
    }
    catch (e) {
        console.log(e);
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
        cancelAccountEmail(req.user.email,req.user.name);
        res.send({user: req.user});
    }
    catch (e) {

    }
});


router.post('/users/me/avatar',auth, upload.single('avatar'), async(req,res) => {
       // req.user.avatar = req.file.buffer;
    const buffer = await sharp(req.file.buffer).resize({width:250, height: 250}).png().toBuffer()
    req.user.avatar = buffer;
    await req.user.save();
        res.send();
}, (error, req, res, next) => {
  console.log(error);
    res.status(400).send({error: error.message});
});

router.delete('/users/me/avatar', auth, async(req,res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar', async(req, res) => {
    try{
       // console.log(req.params.id);
        const _id = req.params.id;
        const user = await User.findById(_id);

        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }
    catch (e) {
        res.status(400).send({error: e})
    }
})

module.exports = router;
