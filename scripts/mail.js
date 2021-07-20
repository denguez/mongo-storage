const transporter = require('nodemailer').createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

module.exports = function (to, content) {
    transporter.sendMail({
            to: to,
            //from: process.env.EMAIL_FROM,
            subject: content.subject,
            text: content.text,
        },
        (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        }
    );
}