const _ = require('lodash');
const { Path }= require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id })
            .select({ recipients: false });

        res.send(surveys);
    });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    });

    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');

         _.chain(req.body)
            .map((event) => {
                const match = p.test(new URL(event.url).pathname);
                if (match) {
                    return { email: event.email, surveyId: match.surveyId, choice: match.choice };
                }
            })

            // Removing the undefined elements in the events array
            .compact()

            // Removing duplicate elements in the events array
            .uniqBy('email', 'surveyId')
            // Issue the query for the iterated events
            .each(event => {
                Survey.updateOne(
                    {
                        _id: event.surveyId,
                        recipients: {
                            $elemMatch: { email: event.email, responded: false }
                        }
                    }, 
                    {
                        $inc: { [event.choice]: 1 },
                        $set: { 'recipients.$.responded': true },
                        lastResponded: new Date()
                    }
                ).exec();
            })
            .value();

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