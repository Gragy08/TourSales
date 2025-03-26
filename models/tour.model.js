const mongoose = require('mongoose');

//Define a schema
const Tour = mongoose.model('Tour', {
    name: String,
    vehicle: String
});

module.exports = Tour;