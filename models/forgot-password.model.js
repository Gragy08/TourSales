const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
    // Store 2 fields email and otp
    email: String,
    otp: String,
    
    // Specify an expiration time for the record
    expiredAt: {
        type: Date,
        expires: 0
      }
    },
    {
        // Automatic create datafield: createAt and updateAt
        timestamps: true, 
    }
);

//Define a schema
const ForgotPassword = mongoose.model('ForgotPassword', schema, "forgot-password");

module.exports = ForgotPassword;