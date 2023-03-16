import nodemailer from "nodemailer";

export const registerEmail = async (data) => {
  const { email, username, token } = data;

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "401afe6f0fb96d",
      pass: "0065a56958b251",
    },
  });

  //Email Info
  const info = await transport.sendMail({
    from: '"UpTask - Your Project Administrator" <accounts@uptask.com>',
    to: email,
    subject: "UpTask - Confirm your account",
    text: "Confirm Your account for Uptask",
    html: `<p>Hi: ${username} Confirm your account </p> 
    <p> Your Account is Almost ready Please confirm using the following Link:
    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Your Account</a></p>
    <p>Please ignore this email if you did not create this account</p>
    `,
  });
};
