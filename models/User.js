const mongoose = require('mongoose')
const { Schema } = mongoose;         // Mongoose object destructuring

// Schema - determines the format for every user record
const userSchema = new Schema({
    googleId: String,
    credits: {
        type: Number,
        default: 0
    }
});

// To create a model class (or collection in this case called users)
mongoose.model('users', userSchema);
