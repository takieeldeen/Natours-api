import { createTransport } from "nodemailer";

type mailOptions = {
  email: string;
  subject: string;
  message: string;
};
export const sendMail = async (options: mailOptions) => {
  const transporter = createTransport({
    host: process.env.EMAIL_PROVIDER_HOST,
    port: +process.env.EMAIL_PROVIDER_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_PROVIDER_USERNAME,
      pass: process.env.EMAIL_PROVIDER_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Natours.io",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
