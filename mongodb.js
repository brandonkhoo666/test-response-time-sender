const mongoose = require('mongoose');

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

async function run() {
    mongoose.connect('mongodb://localhost:27017/test', { })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
}

// Exporting a function
module.exports = {
    run
};