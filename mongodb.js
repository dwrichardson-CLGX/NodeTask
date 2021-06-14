const mongodb = require('mongodb');
//const MongoClient = mongodb.MongoClient;
const {ObjectId} = mongodb;

// const id = new ObjectId();
// console.log(id);
// console.log(id.getTimestamp());
const uri = "mongodb+srv://dwain:dwain@dwainmongo.6kmb3.mongodb.net/Tasks?retryWrites=true&w=majority";
 const MongoClient  = new mongodb.MongoClient(uri,
    { useNewUrlParser: true, useUnifiedTopology: true });
MongoClient.connect(err => {
    if(err){
       return console.log(err);
    }
    const db = MongoClient.db("Tasks");
    const collection = MongoClient.db("Tasks").collection("users");
        // perform actions on the collection object
    console.log('connected')

    const taskCollection = MongoClient.db('Tasks').collection('Tasks');
    const userCollection = MongoClient.db('Tasks').collection('users');
     taskCollection.findOne({description: 'Finish Module'}, (error, user) => {
         console.log(user);
     });

    taskCollection.findOne({_id: new ObjectId('60c69f9e5ec26b69c7adda25')}, (error, user) => {
        console.log(user);
    });
    userCollection.deleteOne({age: 37})
        .then((result) => {
            console.log(result.modifiedCount);
            console.log(result.matchedCount);
        })
        .catch((error => {
            console.log(error);
        }))
        .finally(() => {
            MongoClient.close();
        })

    userCollection.insertOne({name: 'Dwain', age: 37})
        .then((result) => {
            console.log(result.modifiedCount);
            console.log(result.matchedCount);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            MongoClient.close();
        })

/*   const updatePromise = taskCollection.updateOne({_id: new ObjectId('60c69f9e5ec26b69c7adda25')},{
        $set: {
            description: 'Make Lunch'
        }
    });*/

/*    const updateMany = taskCollection.updateMany({completed: false}, {
        $set: { completed: true }
    });

    updateMany.then((result) => {
        console.log(result.modifiedCount);
    }).catch((error) => {
        console.log(error);
    }).finally(() => {
        MongoClient.close();
    })*/

   // updatePromise.then((result) => {
   //      // console.log(result);
   //     console.log(result.matchedCount);
   //     console.log(result.modifiedCount)
   // }).catch((error) => {
   //     console.log(error);
   // });

   // const akilPromise = userCollection.updateOne({name: 'Akil'}, {
   //     $inc: { age: 1}
   // });
   // akilPromise.then((result) => {
   //     console.log(result.matchedCount);
   //     console.log(result.modifiedCount)
   // }).catch((error) => {
   //     console.log(error);
   // });


     // taskCollection.find({completed: true}).ToArray((error,result) =>{
     //     console.log(result);
     //     mongoclient.close();
     // }).then((a) => {
     //
     // });
    // taskCollection.insertOne({
    //     _id: id,
    //     description:'Finish Module',
    //     completed: false
    // }, (error, result) => {
    //
    //     if(error){
    //         return error;
    //     }
    //     console.log(result.ops);
    //     MongoClient.close();
    // });
    // taskCollection.insertMany([
    //     {
    //         description: 'Get Rich',
    //         completed: false
    //     },
    //     {
    //         description: 'FIX PHONE',
    //         completed: false
    //     },
    //     {
    //         description: 'MAKE DINNER',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if(error){
    //         return console.log(error);
    //     }
    //
    //     console.log(result.ops);
    // } );
});
