import nodemailer from 'nodemailer';

export const userActivationTemplate = ({email, name, url}) => {
    return {
        from: `E-commerce <${process.env.SMTP_EMAIL}>`, //this is the sender address
        to: `${email}`, //receivers email
        subject: `'Hello ${name} click the link to activate ypur account.'`,
        html: `
        <p>Hello ${name}</p>
        <br />
        <p>Your account has been created.Click the link to activate the account.</p>
        <br />
        <a href = "${url}">
        <button>Activate your account</button>
        </a> 

        ` //this is the html body

    };
}

export const userActivationNotificationTemplate = ({email, name, url}) => {
    return {
        from: `E-commerce <${process.env.SMTP_EMAIL}>`, //this is the sender address
        to: `${email}`, //receivers email
        subject: `'Hello ${name} your account is activate.'`,
        html: `
        <p>Hello ${name}</p>
        <br />
        <p>Your account has been verified.</p>
        <br />

        ` //this is the html body

    };
}

