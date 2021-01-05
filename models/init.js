const mongoose = require('mongoose');

mongoose.promise = global.Promise

mongoose.connect("mongodb://127.0.0.1:27017/booking")
    .then(() => {
        console.log('Sucessfully connected to the Database')
    })

    .catch(error => {
        console.error('Error connecting to the database', error)
    })

module.exports = mongoose;