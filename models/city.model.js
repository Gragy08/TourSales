const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name: String
    }
);

//Define a schema
const City = mongoose.model('City', schema, "cities");

module.exports = City;