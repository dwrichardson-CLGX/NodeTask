const Task = require('../src/models/task');
require('../src/db/mongoose');

Task.findByIdAndRemove('60c7841fe1d40771b6c1c3d0'
    ).then((task) =>{
        console.log(task);
        return Task.countDocuments({completed: false});
}).then((tasks) => {
    console.log(`there are ${tasks} incomplete tasks`);
});
