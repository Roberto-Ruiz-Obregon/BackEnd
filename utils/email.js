const nodemailer = require('nodemailer');
const pug = require('pug');
const { htmlToText } = require('html-to-text');

/* The above code is creating a class called Email. The constructor is taking in two parameters, user
and url. The constructor is also setting the to, firstName, url, and from properties. The
newTransport method is creating a new transport object based on the environment. The send method is
rendering the html based on the template and subject. The send method is also defining the mail
options and sending the email. The sendWelcome method is calling the send method and passing in the
welcome template and subject. The sendPasswordReset method is calling the send method and passing in
the passwordReset template */
module.exports = class Email {
    /**
     * The constructor function is a special method for creating and initializing an object created
     * within a class.
     * @param user - The user object that contains the email and name of the user.
     * @param url - The URL that the user will be sent to in order to reset their password.
     */
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
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
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
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
                subject,
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
            'Recuperar contraseña (valido por solo 10 minutos)'
        );
    }
};
