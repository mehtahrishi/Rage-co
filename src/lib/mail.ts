import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL || 'clothrage@gmail.com',
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendOtpEmail(to: string, otp: string) {
    const mailOptions = {
        from: process.env.SMTP_EMAIL || 'clothrage@gmail.com',
        to,
        subject: 'Your Login OTP - Rage Co',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #000; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Rage Co</h1>
        </div>
        <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Login Verification</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Hello,</p>
        <p style="color: #555; font-size: 16px; line-height: 1.5;">Please use the following One-Time Password (OTP) to complete your login. This code is valid for 2 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="background-color: #f0f0f0; color: #000; padding: 15px 30px; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px; border: 1px solid #ccc;">${otp}</span>
        </div>
        <p style="color: #555; font-size: 14px; text-align: center;">If you didn't request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Rage Co. All rights reserved.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
}
