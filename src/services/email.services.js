import nodemailer from 'nodemailer';
import config from '../config/index.js';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email.user,
                pass: config.email.password
            }
        })
    }

    sendEmail(to, subject, html, attachments = []) {
        return this.transporter.sendMail({
            from: config.email.user,
            to,
            subject,
            html,
            attachments
        })
    }
}

export default new EmailService();