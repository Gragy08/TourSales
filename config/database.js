const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to database');

    } catch (error) {
        console.log('Error connecting to database', error);
    }
}