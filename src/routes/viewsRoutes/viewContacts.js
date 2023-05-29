import { Router } from "express";
import emailServices from "../../services/email.services.js";
import __dirname from "../../utils.js";

const router = Router();

// PaAGINA DE MAILING AND SMS
router.get('/', async (req, res) => {
    res.render('contact');
})


// ENVÍO DE MAIL
router.get('/mail', async (req, res) => {
    const attachments = [
        {
            filename: 'logoCayena.jpg',
            path: (__dirname + '/public/images/logoCayena/logoCayena.jpg'),
            cid: 'logoCayena'
        }
    ]
    const result = await emailServices.sendEmail(
        'seba_orozco@hotmail.com',
        'Prueba de envío de correo',
        `
        <div>
            <p>Te envío el logo de Cayena asi lo revises.</p>
            <h1>Hola. Como estas?</h1>'
            <img src="cid: logoCayena" />
            <p>Saludos!</p>
        </div>
        `,
        attachments
    )
    console.log(result);
    res.render('mail');
})

// ENVÍO DE SMS
router.get('/sms', async (req, res) => {
    res.render('sms');
})

export default router;