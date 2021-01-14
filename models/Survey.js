const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
    title: String,
    body: String,
    subject: String,
    // a list or an array of recipient schema records
    recipients: [RecipientSchema],          
    yes: { type: Number, default: 0 },
    no: { type: Number, default: 0 },
    // to distinguish which survey belongs to which user
    // _user -> sets up a relationship between a given schema and a given user
    // ref: 'User' -> the reference it belongs to is the User's collection/model
    _user: { type: Schema.Types.ObjectId, ref: 'User'},
    dateSent: Date,
    lastResponded: Date   
});

mongoose.model('surveys', surveySchema);