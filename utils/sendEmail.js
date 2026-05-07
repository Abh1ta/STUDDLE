import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (to, username) => {
  await transporter.sendMail({
    from: `"Studdle" <${process.env.EMAIL_USER}>`,
    to,
<<<<<<< HEAD
    subject: "Bun venit pe Studdle! 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #5D5FEF;">Bun venit, ${username}! 👋</h2>
=======
    subject: "Bun venit pe Studdle! ",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #5D5FEF;">Bun venit, ${username}! </h2>
>>>>>>> origin/settings-avatar_settings
        <p>Contul tău a fost creat cu succes. Te poți autentifica oricând.</p>
        <p style="color: #888; font-size: 13px;">Dacă nu tu ai creat acest cont, ignoră acest email.</p>
      </div>
    `,
  });
};