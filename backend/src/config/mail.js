import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

let transporter = null;

export const initializeMail = () => {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    logger.info('Mail transporter initialized');
  } catch (error) {
    logger.error('Failed to initialize mail transporter:', error);
  }
};

export const sendMail = async (options) => {
  if (!transporter) {
    throw new Error('Mail transporter not initialized');
  }

  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent:', info.messageId);
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email, verificationUrl) => {
  const html = `
    <h1>Email Verification</h1>
    <p>Please click the link below to verify your email:</p>
    <a href="${verificationUrl}">${verificationUrl}</a>
    <p>This link will expire in 24 hours.</p>
  `;

  return sendMail({
    to: email,
    subject: 'Verify Your Email',
    html,
  });
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
  const html = `
    <h1>Password Reset</h1>
    <p>Please click the link below to reset your password:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you did not request this, please ignore this email.</p>
  `;

  return sendMail({
    to: email,
    subject: 'Reset Your Password',
    html,
  });
};

export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <h1>Welcome to Neosix!</h1>
    <p>Hello ${name},</p>
    <p>Thank you for joining Neosix. We're excited to have you on board!</p>
  `;

  return sendMail({
    to: email,
    subject: 'Welcome to Neosix',
    html,
  });
};
