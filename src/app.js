const express = require('express');
require('./db/mongoose');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const app = express();
//console.log(process.env);
const port = process.env.PORT; // || 3000;
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;



