import nodemailer from "nodemailer";

export const registerEmail = async (data) => {
  const { email, username, token } = data;

  const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
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

export const emailForgotPassword = async (data) => {
  console.log("Hola");
  const { email, username, token } = data;

  //TODO move to env
  const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  //Email Info
  const info = await transport.sendMail({
    from: '"UpTask - Your Project Administrator" <accounts@uptask.com>',
    to: email,
    subject: "UpTask - Reset your password",
    text: "Reset your password",
    html: `<p>Hi: ${username} You have requested to Reset your password </p> 
    <p style="color: red"> Follow the Link below to reset your password:
    <a href="${process.env.FRONTEND_URL}/forgot-password/${token}">Reset your password</a></p>
    <p>If your did not request to reset the password please ignore this email!</p>
    `,
  });
};
