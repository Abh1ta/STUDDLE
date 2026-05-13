import nodemailer from "nodemailer";

let transporter;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (emailUser && emailPass) {
  transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
} else {
  console.warn(
    "Email transporter is not configured. Set EMAIL_USER and EMAIL_PASS in backend/.env to enable email sending.",
  );
}

export const sendWelcomeEmail = async (to, username) => {
  if (!transporter) {
    console.warn(
      `Skipping welcome email to ${to}: SMTP credentials are not configured.`,
    );
    return;
  }

  await transporter.sendMail({
    from: `"Studdle" <${emailUser}>`,
    to,
    subject: "Bun venit pe Studdle! ",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #5D5FEF;">Bun venit, ${username}! </h2>
        <p>Contul tău a fost creat cu succes. Te poți autentifica oricând.</p>
        <p style="color: #888; font-size: 13px;">Dacă nu tu ai creat acest cont, ignoră acest email.</p>
      </div>
    `,
  });
};
