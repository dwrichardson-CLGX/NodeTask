const sgMail = require('@sendgrid/mail');

//const apikey = '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';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'dwain.richardson@gmail.com',
        subject: 'This is my first creation',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    });
}

const cancelAccountEmail = (email, name) => {
    sgMail.send({
        to:email,
        from: 'dwain.richardson@gmail.com',
        subject: `Don't Leave ${name}`,
        text: `We are sorry to see you go ${name}, let us know what we could have done better`
    })
}

module.exports = {
    sendWelcomeEmail,
    cancelAccountEmail
}

