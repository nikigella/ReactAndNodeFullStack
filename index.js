//to get access to the express library
const express = require('express');  
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Survey');
require('./services/passport');

// Using mongoose to connect to the mongodb database
mongoose.connect(keys.mongoURI);

//Generates a new application which represents a running express app 
const app = express();

//app.use() -> wiring up middleware functionalities

// POST/PUT request type - Parses the request body and assigns that to the req.body to the route handlers
app.use(bodyParser.json());

//Telling the application to make use of cookies
app.use(
    // Calling the cookieSession() function
    // {} -> config object
    // first param -> maxAge -> how long the cookie can exist in the browser before it automatically expires
    // second param -> key -> used to encrypt our cookie
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);

//Telling passport to make use of cookies to handle authentication
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

// If we are on Heroku and in production, run this block of code below
if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    // like our main.js or main.css file!
    app.use(express.static('client/build'));

    // Express will serve up the index.html file
    // if it doesn't recognize the route
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

//Route handler associated with a given route

/*
    1. app - Express App to register this route handler with
    2. get - watch for incoming requests with this method
    3. '/' - watch for requests to access a very particular route
    4. req - object representing the incoming request
    5. res - object representing the outgoing response
    6. res.send({ hi: 'there'} - immediately send some JSON back to who ever made this request

*/
// app.get('/', (req, res) => {
//     res.send({ bye: 'buddy'});
// });

//Dynamically figure out what PORT heroku should be listening to
// If env variable is defined by heroku, use PORT otherwise use 5000 (Prod. vs Dev. env)
const PORT = process.env.PORT || 5000;
//Node wants to listen to incoming requests (traffic) on port 5000
app.listen(PORT);