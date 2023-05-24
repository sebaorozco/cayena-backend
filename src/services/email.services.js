import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })
    }

    sendEmail() {
        this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,

        })
    }
}

export default new EmailService();