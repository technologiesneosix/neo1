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
      family: 4, // Force IPv4 to prevent ENETUNREACH issues on cloud hosting providers
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
    logger.error('Error sending email: ' + (error?.message || error), error);
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

export const sendContactNotificationEmail = async (adminEmail, details) => {
  const { name, email, phone, company, subject, message } = details;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 32px 16px; color: #334155; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 2px solid #0284c7;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">New Website Enquiry</h2>
        </div>
        <div style="padding: 32px 24px;">
          <p style="margin-top: 0; font-size: 16px; color: #475569;">Hello Admin,</p>
          <p style="font-size: 15px; color: #475569;">A new enquiry has been submitted through the contact form. Here are the details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; width: 120px; vertical-align: top;">Name:</td>
              <td style="padding: 10px 0; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: top;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Email:</td>
              <td style="padding: 10px 0; color: #0284c7; border-bottom: 1px solid #f1f5f9; vertical-align: top;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Phone:</td>
              <td style="padding: 10px 0; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: top;">${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Company:</td>
              <td style="padding: 10px 0; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: top;">${company || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Subject:</td>
              <td style="padding: 10px 0; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: top; font-weight: 500;">${subject}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; vertical-align: top;">Message:</td>
              <td style="padding: 10px 0; color: #334155; white-space: pre-wrap; vertical-align: top;">${message}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 32px;">
            <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; background-color: #0284c7; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 4px rgba(2,132,199,0.25);">
              Reply Directly to ${name}
            </a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          This is an automated notification from Neosix Admin Panel.
        </div>
      </div>
    </div>
  `;

  return sendMail({
    to: adminEmail,
    subject: `[New Enquiry] ${subject} - from ${name}`,
    html,
  });
};

export const sendContactConfirmationEmail = async (userEmail, details) => {
  const { name, subject } = details;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 32px 16px; color: #334155; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 2px solid #0284c7;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">Message Received</h2>
        </div>
        <div style="padding: 32px 24px;">
          <p style="margin-top: 0; font-size: 16px; color: #0f172a; font-weight: 600;">Dear ${name},</p>
          <p style="font-size: 15px; color: #475569;">Thank you for reaching out to Neosix. We have successfully received your enquiry regarding "<strong>${subject}</strong>".</p>
          <p style="font-size: 15px; color: #475569;">Our team is reviewing your message and we will get back to you at this email address as soon as possible.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">Warm regards,<br><strong>The Neosix Team</strong></p>
        </div>
        <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          © ${new Date().getFullYear()} Neosix. All rights reserved.
        </div>
      </div>
    </div>
  `;

  return sendMail({
    to: userEmail,
    subject: `We've received your enquiry - Neosix`,
    html,
  });
};

export const sendJobApplicationNotificationEmail = async (adminEmail, details) => {
  const { name, email, phone, careerTitle, resumeUrl, coverLetter } = details;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 32px 16px; color: #334155; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 2px solid #0284c7;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">New Job Application</h2>
        </div>
        <div style="padding: 32px 24px;">
          <p style="margin-top: 0; font-size: 16px; color: #475569;">Hello Admin,</p>
          <p style="font-size: 15px; color: #475569;">A new candidate has applied for the <strong>${careerTitle}</strong> position. Here are the applicant details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; width: 120px; vertical-align: top;">Applicant:</td>
              <td style="padding: 10px 0; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: top;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Email:</td>
              <td style="padding: 10px 0; color: #0284c7; border-bottom: 1px solid #f1f5f9; vertical-align: top;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Phone:</td>
              <td style="padding: 10px 0; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: top;">${phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Position:</td>
              <td style="padding: 10px 0; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: top; font-weight: 500;">${careerTitle}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; vertical-align: top;">Cover Letter:</td>
              <td style="padding: 10px 0; color: #334155; white-space: pre-wrap; vertical-align: top;">${coverLetter || 'None provided.'}</td>
            </tr>
          </table>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${resumeUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background-color: #0284c7; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 4px rgba(2,132,199,0.25); margin: 0 8px;">
              View Resume
            </a>
            <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; box-shadow: 0 2px 4px rgba(15,23,42,0.2); margin: 0 8px;">
              Contact Applicant
            </a>
          </div>
        </div>
        <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          This is an automated notification from Neosix Career Portal.
        </div>
      </div>
    </div>
  `;

  return sendMail({
    to: adminEmail,
    subject: `[New Application] ${careerTitle} - from ${name}`,
    html,
  });
};

export const sendJobApplicationConfirmationEmail = async (userEmail, details) => {
  const { name, careerTitle } = details;
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 32px 16px; color: #334155; line-height: 1.6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background-color: #0f172a; padding: 24px; text-align: center; border-bottom: 2px solid #0284c7;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">Application Received</h2>
        </div>
        <div style="padding: 32px 24px;">
          <p style="margin-top: 0; font-size: 16px; color: #0f172a; font-weight: 600;">Dear ${name},</p>
          <p style="font-size: 15px; color: #475569;">Thank you for applying for the <strong>${careerTitle}</strong> role at Neosix!</p>
          <p style="font-size: 15px; color: #475569;">We have successfully received your job application and resume. Our recruiting team will review your application details against the requirements for this position.</p>
          <p style="font-size: 15px; color: #475569;">If your profile matches what we're looking for, we will contact you directly to schedule an interview.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">Best of luck,<br><strong>Neosix Recruitment Team</strong></p>
        </div>
        <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
          © ${new Date().getFullYear()} Neosix. All rights reserved.
        </div>
      </div>
    </div>
  `;

  return sendMail({
    to: userEmail,
    subject: `Application received for ${careerTitle} - Neosix`,
    html,
  });
};
