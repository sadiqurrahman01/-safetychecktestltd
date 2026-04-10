const nodemailer = require("nodemailer");

const DEFAULT_FROM = '"Safety Check Test Ltd" <quote@safetychecktestltd.co.uk>';
const DEFAULT_REPLY_TO = '"Safety Check Test Ltd" <support@safetychecktestltd.co.uk>';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE || "true") === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail({
  to,
  subject,
  html,
  text,
  from = DEFAULT_FROM,
  replyTo = DEFAULT_REPLY_TO,
}) {
  return transporter.sendMail({
    from,
    replyTo,
    to,
    subject,
    html,
    text,
  });
}

module.exports = {
  transporter,
  sendEmail,
  DEFAULT_FROM,
  DEFAULT_REPLY_TO,
};
