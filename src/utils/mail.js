import Mailgen from "mailgen";
import nodemailer from "nodemailer";
import { ApiError } from '../utils/api-errors.js'

// configure the legos under the 'sendMail' method which can be called to send emails
const sendMail = async (options) => {

    // configure the nodemailer transporter which send the mail (using mailtrap)
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS,
        },
    });

    // general mailgen theme & the product info is configured here
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Project-Camp',
            link: 'https://project-camp.js/',
        },
    });

    // generate plain text version of the email
    const emailText = mailGenerator.generatePlaintext(options.mailGenContent);
    // generate html version of the email
    const emailHtml = mailGenerator.generate(options.mailGenContent);


    // configure from, to, subject, & content of the mail
    const mail = {
        from: 'mail.taskmanager@example.com',
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHtml
    };

    // send above crafted email using the nodemailer transporter in a try-catch block
    try {
        await transporter.sendMail(mail);
    } catch (error) {
        const extractedErrors = [];
        extractedErrors.push(error);
        throw new ApiError(400, { message: "Error sending email" }, extractedErrors);
    }
}

// factory method for email verification flow
// this will replace 'mailGenContent' in the 'options' object
const emailVerificationMailGenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to Project Camp! We are excited to have you onboard.",
            action: {
                instructions: 'To get started with Project-Camp, please click here:',
                button: {
                    color: "#22BC66", // Optional action button color
                    text: 'Verify your email',
                    link: verificationUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

}

// factory method for forgot password flow
// this will replace 'mailGenContent' in the 'options' object
const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset your password",
            action: {
                instructions: 'Please click here to reset your password:',
                button: {
                    color: "#22BC66", // Optional action button color
                    text: 'Reset your password',
                    link: passwordResetUrl
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

}

/*

Whenever I want to send email, I can use this sendEmail method in a clean way

sendMail({
    email: user.email,
    subject: "xxx",
    mailGenContent: emailVerificationMailGenContent
})

*/