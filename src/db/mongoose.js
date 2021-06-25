const mongoose = require('mongoose');
const validator = require('validator');
const uri = process.env.MONGODB_URL;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});




// const me = new User({
//     name: ' Tiffany  ',
//     email: 'Tiffany@hotmail.com',
//     age: 30,
//     password:'abc123'
// });

// const task = new Task({
//     description: 'Learn Something',
//     completed: true
// });
//
// task.save().then(() => {
//     console.log(task);
// }).catch((error) => {
//     console.log(error)
// })

 // me.save().then(() => {
 //     console.log(me);
 // }).catch((error) => {
 //     console.log('Error', error);
 // }).finally(() => {
 //     mongoose.disconnect();
 // });


 // wde@gotofirst.com
