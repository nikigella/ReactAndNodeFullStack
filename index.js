//to get access to the express library
const express = require('express');  
//Generates a new application which represents a running express app 
const app = express();      

//Route handler associated with a given route

/*
    1. app - Express App to register this route handler with
    2. get - watch for incoming requests with this method
    3. '/' - watch for requests to access a very particular route
    4. req - object representing the incoming request
    5. res - object representing the outgoing response
    6. res.send({ hi: 'there'} - immediately send some JSON back to who ever made this request

*/
app.get('/', (req, res) => {
    res.send({ bye: 'buddy'});
});

//Dynamically figure out what PORT heroku should be listening to
// If env variable is defined by heroku, use PORT otherwise use 5000 (Prod. vs Dev. env)
const PORT = process.env.PORT || 5000;
//Node wants to listen to incoming requests (traffic) on port 5000
app.listen(PORT);