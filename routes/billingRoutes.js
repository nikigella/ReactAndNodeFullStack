const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {
    //POST request made to the stripe api
    app.post('/api/stripe', requireLogin, async (req, res) => {
        // If the passport middleware didn't find a user
        if (!req.user) {
            return res.status(401).send({ error: 'You must log in!' });      // Unauthorized user
        }

        // Creating the charge object to bill the user
       const charge = await stripe.charges.create({
           amount: 500,
           currency: 'usd',
           description: '$5 for 5 credits',
           source: req.body.id
       });

       //Take the user model, add 5 credits, and send that back to the client

       //Accessing the current user model
       req.user.credits += 5;

       // Save the above changes to the database
       // Returns a new version of the user model
       const user = await req.user.save()  

       //Respond to the request
       res.send(user)

       console.log(charge);
    });
};