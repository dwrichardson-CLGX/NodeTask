const Task = require('../src/models/task');
require('../src/db/mongoose');

// Task.findByIdAndRemove('60c7841fe1d40771b6c1c3d0'
//     ).then((task) =>{
//         console.log(task);
//         return Task.countDocuments({completed: false});
// }).then((tasks) => {
//     console.log(`there are ${tasks} incomplete tasks`);
// });

const deleteTaskAndCount = async(id) => {
    const task = await Task.findByIdAndRemove(id);
    const count = await Task.countDocuments({completed: false});
    return count;
}

deleteTaskAndCount('60c783a8321c5b7167a9c398').then((count) => {
    console.log(`there are ${count} incomplete tasks`);
}).catch((err) => {
    console.log(err);
})
