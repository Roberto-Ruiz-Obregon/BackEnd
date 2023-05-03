const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const pug = require('pug');
const { htmlToText } = require('html-to-text');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

dotenv.config({ path: './config.env' });

/* The above code is creating a class called Email. The constructor is taking in two parameters, user
and url. The constructor is also setting the to, firstName, url, and from properties. The
newTransport method is creating a new transport object based on the environment. The send method is
rendering the html based on the template and subject. The send method is also defining the mail
options and sending the email. The sendWelcome method is calling the send method and passing in the
welcome template and subject. The sendPasswordReset method is calling the send method and passing in
the passwordReset template */

module.exports = class Email {
    /**
     * It takes in a user object, a url, a course object, and an image, and then sets the to, image,
     * firstName, url, from, and course properties of the object to the values of the arguments passed
     * in.
     * @param user - The user object that contains the email address of the recipient.
     * @param url - The URL of the course
     * @param [course] - {
     * @param [image] - the image to be displayed in the email
     */
    constructor(user, url, course = {}, image = '', message = '') {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.course = course;
        this.image = image;
        this.message = message;
        this.from = `Asociacion Roberto Ruiz Obregon <${process.env.EMAIL_FROM}>`;
    }

    /**
     * It creates a new transport object using the nodemailer library.
     *
     * The transport object is used to send emails.
     *
     * The transport object is created using the host, port, username, and password that we set in our
     * .env file.
     * @returns A new instance of the nodemailer transport object.
     */
    newTransport() {
        // Crea un nuevo objeto OAuth2
        const myOAuth2Client = new OAuth2(
            process.env.OAUTH_CLIENTID, // Identificador del cliente (Client ID)
            process.env.OAUTH_CLIENT_SECRET, // Secreto del cliente (Client Secret)
            'https://developers.google.com/oauthplayground' // URI de redireccionamiento
        );

        // Configura las credenciales del cliente OAuth2, que incluyen un token de actualización (refresh token)
        myOAuth2Client.setCredentials({
            refresh_token: process.env.OAUTH_REFRESH_TOKEN, // Token de actualización (refresh token)
            refresh_token: process.env.OAUTH_REFRESH_TOKEN, // Token de actualización (refresh token)
            expiry_date: true,
        });

        // verifica si la token ha expirado o esta por expirar dentro de 5 minutos
        if (
            myOAuth2Client.credentials.expiry_date - Date.now() <
            1000 * 60 * 5
        ) {
            // si la token está por expirar, la renovamos con el refresh token
            myOAuth2Client.refreshAccessToken((err, tokens) => {
                if (err) {
                    console.log('Error al refrescar el token:', err);
                } else {
                    console.log('Token actualizado:', tokens);
                    myOAuth2Client.setCredentials(tokens);
                }
            });
        }

        const accessToken = myOAuth2Client.getAccessToken();

        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                accessToken: accessToken, //access token variable we defined earlier
                refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            },
        });
    }

    /**
     * The function takes in a template and a subject, renders the template using the data from the
     * object, defines the email options, creates a new transport and sends the email.
     * @param template - The name of the template file that we want to use.
     * @param subject - The subject of the email
     */
    async send(template, subject) {
        const html = pug.renderFile(
            `${__dirname}/../views/emails/${template}.pug`,
            // The second argument will be an object of data that will populate the template
            {
                firstName: this.firstName,
                url: this.url,
                course: this.course,
                subject,
                message: this.message,
                imageUrl: this.image,
            }
        );

        // define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            // npm i html-to-text
            text: htmlToText(html, { wordwrap: 130 }),
        };

        //  create transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    /**
     * The function sendWelcome() is an asynchronous function that sends a welcome message to the user.
     */
    async sendWelcome() {
        // esto va a ser una pug template
        await this.send(
            'welcome',
            'Bienvenido a la familia Roberto Ruiz Obregon!'
        );
    }

    /**
     * It sends a password reset email to the user.
     */
    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Recuperar contraseña (válido por solo 10 minutos)'
        );
    }

    /**
     * It sends an email for inscription alerts
     */
    async sendInscriptonAlert() {
        await this.send(
            'inscriptionAlert',
            `Gracias por inscribirte al curso ${this.course.courseName}`
        );
    }

    /**
     * It sends a message to the client
     * @param message - The message to send to the client.
     */
    async sendAnnouncement(message) {
        await this.send('inscriptionAlert', message);
    }
    /**
     * It sends a message to the client
     * @param message - The message to send to the client.
     */
    async sendNewCourse(message) {
        await this.send(
            'newCourseAlert',
            'Hemos creado este curso nuevo para ti!'
        );
    }

    /**
     * We are sending a message to the user that we have received their payment request and we are
     * reviewing it.
     */
    async sendPaymentStartedAlert() {
        await this.send(
            'paymentStartedAlert',
            'Hemos recibido tu petición de pago y la estamos revisando!'
        );
    }

    /**
     * This function sends a message to the user that their payment has been accepted.
     */
    async sendPaymentAcceptedAlert() {
        await this.send(
            'paymentAcceptedAlert',
            'Hemos confirmado tu información de pago para el curso!'
        );
    }

    /**
     * It sends a message to the user that their payment has been accepted.
     */
    async sendPaymentRejectedAlert() {
        await this.send(
            'paymentRejectedAlert',
            'No hemos podido confirmar tu información de pago para el curso. Contáctanos si crees que es un error.'
        );
    }

    /**
     * It sends a message to all their users
     */
    async sendEmailEveryone(subject) {
        await this.send('emailToEveryone', subject);
    }

    /**
     * It takes an array of users, a url, an image, and a message, and sends an email to each user in
     * the array.
     * @param users - an array of user objects
     * @param url - The url of the announcement
     * @param image - the image to be displayed in the email
     * @param message - The message you want to send to the user
     */
    static async sendMultipleAnnouncement(users, url, image, message) {
        const promises = users.map((user) => {
            const email = new Email(user, url, {}, image);
            return email.sendAnnouncement(message);
        });
        await Promise.all(promises);
    }

    /**
     * It takes an array of users and a course, creates an email for each user, and sends the email.
     * @param users - an array of users
     * @param course - the course the announcement will be based on
     */
    static async sendMultipleNewCourseAlert(users, course) {
        const promises = users.map((user) => {
            const email = new Email(user, '', course);
            return email.sendNewCourse();
        });
        await Promise.all(promises);
    }

    /**
     * It takes an array of users, a url, an image, and a message, and sends an email to each user in
     * the array.
     * @param users - an array of user objects
     * @param url - The url of the announcement
     * @param image - the image to be displayed in the email
     * @param message - The message you want to send to the user
     */
    static async sendAnnouncementToEveryone(
        users,
        url = '',
        image = '',
        message = '',
        subject = ''
    ) {
        const promises = users.map((user) => {
            const email = new Email(user, url, {}, image, message);
            return email.sendEmailEveryone(subject);
        });
        await Promise.all(promises);
    }
};
