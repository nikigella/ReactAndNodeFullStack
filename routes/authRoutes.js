const passport = require('passport');

module.exports = (app) =>  {
    // Route handler to kick the user into the passport js (google oauth) flow
    app.get('/auth/google', passport.authenticate('google', {
        // Asking google to give us access to a user's profile and email
        scope: ['profile', 'email']
        })
    );

    // Route handler to handle the case in which the user visits /auth/google/callback
    // Exchange the code to get the user's profile from the google server
    // passport.authenticate('google') is a middleware function
    app.get(
        '/auth/google/callback', 
        passport.authenticate('google'),
        (req, res) => {
            res.redirect('/surveys');
        } 
    );

    //An authenticate user makes a request to the below route and they log out
    app.get('/api/logout', (req, res) => {
        req.logout();
        // res.send(req.user);   //req.user is destroyed by passport
        res.redirect('/');
    });

    app.get('/api/current_user', (req, res) => {
        // Someone already went through the oauth flow and get access to the user
        res.send(req.user);
    });
};
