import nodemailer from 'nodemailer';

type options = {
  email: string;
  subject: string;
  message: string;
};

export const sendEmail = async (options: options) => {
  const transporter = nodemailer.createTransport({
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT as string),
  });

  const mailOptions = {
    from: 'Lucas Schulze <admin@admin.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
