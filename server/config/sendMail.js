import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

});

const sendMail = async (
  to,
  subject,
  html
) => {

  try {

    // VERIFY SMTP CONNECTION
    await transporter.verify();

    console.log("✅ Gmail SMTP Connected");

    // SEND MAIL
    const info =
      await transporter.sendMail({

        from:
          `"JPMS Team" <${process.env.EMAIL_USER}>`,

        to,

        subject,

        html,

      });

    console.log(
      "✅ Mail Sent Successfully"
    );

    console.log(info.response);

    return true;

  } catch (error) {

    console.error(
      "❌ MAIL ERROR:"
    );

    console.error(error);

    return false;
  }
};

export default sendMail;