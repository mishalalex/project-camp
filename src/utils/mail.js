import Mailgen from "mailgen";
import nodemailer from "nodemailer";


const sendMail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Task Manager',
            link: 'https://mailgen.js/',
        },
    });

    const emailText = mailGenerator.generatePlaintext(email);
}


