const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    status: String
});

//Define a schema
const AccountAdmin = mongoose.model('AccountAdmin', schema, "account-admin");

module.exports = AccountAdmin;