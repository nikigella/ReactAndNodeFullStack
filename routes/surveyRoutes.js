const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
    app.get('/api/surveys/thanks', (req, res) => {
        res.send('Thanks for voting!');
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        console.log(req.body)
        res.send({})
    });

    // Create a new survey
    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
       const { title, subject, body, recipients } = req.body;

       // Creating the survey
       const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map(email => { return { email: email.trim() }}),
            _user: req.user.id,
            dateSent: Date.now()        //records when we have created and sent off the survey
       });

       // Send email
       const mailer = new Mailer(survey, surveyTemplate(survey));

       try {
            // mailer.send() -> it's an async function
            await mailer.send();
            // Save our survey to the database
            await survey.save();
            // Deduct one credit from our user and save our user
            req.user.credits -= 1
            const user = await req.user.save();

            res.send(user);
       } catch (err) {
           res.status(422).send(err);
       }

    });
};