const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//TODO
// Add id in????
// fix int issues
const  CustomerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
    },
    customerType: {
        type: String,
        required: true
    },
    creditCardNum: {
        type: Number,
    },
    expDate: {
        type: Date,
    },
    securityCode: {
        type: Number,
    }
});

module.exports = Customer = mongoose.model('Customer', CustomerSchema);