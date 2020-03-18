const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//TODO
// Add id in
const ExchangeRateSchema = new Schema({
    currencyCode: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    toUSDRate: {
        type: Number,
        required: true
    }
});

// eslint-disable-next-line no-undef
module.exports = ExchangeRate = mongoose.model(
    'ExchangeRate',
    ExchangeRateSchema
);
