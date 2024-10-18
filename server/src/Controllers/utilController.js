const mailer = require('nodemailer');
require('dotenv').config();

const transporter = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: "unitedwarrantyservice@gmail.com",
        pass: process.env.GOOGLE_OAUTH_PASS,
    }
});

const sendEmail = async (addresses = ["kimdanny0603@gmail.com"], subject, body, attachments = []) => {
    try {
        const email = {
            from: "United Web Service",
            to: process.env.MODE === "DEV" ? "kimdanny0603@gmail.com" : addresses,
            subject: subject,
            html: body,
            attachments: attachments.map(file => ({
                filename: file.filename,
                content: file.content, // Changed from 'path' to 'content'
                contentType: file.contentType, // Changed from 'mimetype' to 'contentType'
            })),
        };

        await transporter.sendMail(email);
        return true;
    } catch (err) {
        console.error("Error sending email:", err);
        return false;
    }
}

module.exports = {
    sendEmail
};