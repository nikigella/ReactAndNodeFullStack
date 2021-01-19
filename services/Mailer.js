const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

// helper.Mail -> spits out a Mailer, think of Component base class
// helper.Mail -> represented as the component base class
class Mailer extends helper.Mail {
    constructor({ subject, recipients }, content) {
        super();

        this.sgApi = sendgrid(keys.sendGridKey);
        this.from_email = new helper.Email('nikigella@hotmail.com');
        this.subject = subject;
        this.body = new helper.Content('text/html', content);
        this.recipients = this.formatAddresses(recipients);

        // Mail has functionality for the addContent method
        this.addContent(this.body);

        //Enable click tracking inside of our email (enables the step where sendgrid identifies the user
        // and knows who the recipient of the email is)

        // Sengrid replaces the links in the email with their own links
        this.addClickTracking();

        this.addRecipients();
    }

    // Our own helper method
    formatAddresses(recipients) {
        return recipients.map(({ email }) => {
            return new helper.Email(email);
        });
    }

    // Our own helper method - but implemented with Sendgrid standard code
    addClickTracking() {
        const trackingSettings = new helper.TrackingSettings();
        const clickTracking = new helper.ClickTracking(true, true);

        trackingSettings.setClickTracking(clickTracking);
        this.addTrackingSettings(trackingSettings);
    }

    // Our own helper method - but implemented with Sendgrid standard code
    addRecipients() {
        const personalize = new helper.Personalization();
        this.recipients.forEach(recipient => {
            // recipient -> email from return new helper.Email(email)
            personalize.addTo(recipient);
        });
        this.addPersonalization(personalize);
    }

    // To send the mailer object to the sendgrid api to send out the emails
    async send() {
        // SendGrid api request
        const request = this.sgApi.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: this.toJSON()
        });

        // Sending off the above request to SendGrid
        const response = await this.sgApi.API(request)
        return response;
    }
}

module.exports = Mailer;