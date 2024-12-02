import nodemailer from "nodemailer";

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  const transporter = nodemailer.createTransport({
    host: "smtp.c1.liara.email",
    port: 465,
    secure: true,
    auth: {
      user: "magical_hamilton_gkdhri",
      pass: "6e970596-06d0-4c8f-a27a-1b1785e0909b",
    },
  });

  const mailOptions = {
    from: `"Ui Vision"  <info@beta.vosooghi.group>`,
    to,
    subject,
    text,
    html,
    headers: {
      "x-liara-tag": "test_email",
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
