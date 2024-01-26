import nodemailer from "nodemailer";

const { SEND_EMAIL, SEND_EMAIL_PASS } = process.env;

const nodemailerConfig = {
  host: "smtp.ukr.net",
  port: 465, // 25, 465, 2525
  secure: true,
  auth: {
    user: SEND_EMAIL,
    pass: SEND_EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (data) => {
  const email = { ...data, from: SEND_EMAIL };
  return transporter.sendMail(email);
};
