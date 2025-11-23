// server/utils/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Quick Connect" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const subject = 'Verify Your Email Address';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Quick Connect!</h2>
      <p>Please verify your email address by clicking the button below:</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 10px 20px; background: #1677ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Verify Email
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

  return sendEmail(user.email, subject, html);
};

export const sendPasswordResetEmail = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>You requested to reset your password. Click the button below to set a new password:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; padding: 10px 20px; background: #1677ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Reset Password
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  return sendEmail(user.email, subject, html);
};