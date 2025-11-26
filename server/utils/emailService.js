import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASS'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars.join(', '));
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing required email configuration');
  }
}

// Create a test account if in development
const createTestAccount = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      return {
        user: testAccount.user,
        pass: testAccount.pass,
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
      };
    } catch (error) {
      console.error('Failed to create test account:', error);
      return null;
    }
  }
  return null;
};

// Create transporter
const createTransporter = async () => {
  // In development, use ethereal.email for testing
  if (process.env.NODE_ENV === 'development') {
    const testAccount = await createTestAccount();
    if (testAccount) {
      return nodemailer.createTransport({
        host: testAccount.host,
        port: testAccount.port,
        secure: testAccount.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }
  }

  // In production, use Gmail SMTP
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async (to, subject, text, html) => {
  if (!to) {
    console.error('No recipient email address provided');
    return false;
  }

  let transporter;
  try {
    transporter = await createTransporter();
    if (!transporter) {
      throw new Error('Failed to create email transporter');
    }

    const mailOptions = {
      from: `"Quick-Connect" <${process.env.EMAIL_USER || 'noreply@quickconnect.com'}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject || 'No Subject',
      text: text || '',
      html: html || text?.replace(/\n/g, '<br>') || '',
    };

    console.log(`Sending email to: ${to}, Subject: ${subject}`);
    
    const info = await transporter.sendMail(mailOptions);
    
    // In development, log the test email URL
    if (process.env.NODE_ENV === 'development' && info) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    console.log('Email sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('SMTP Error Response:', {
        code: error.responseCode,
        message: error.response,
      });
    }
    
    return false;
  }
};
