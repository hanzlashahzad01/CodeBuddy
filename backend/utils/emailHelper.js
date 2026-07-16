const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send Welcome Email
const sendWelcomeEmail = async (email, name) => {
  try {
    console.log('📧 Attempting to send welcome email to:', email);
    console.log('📧 Email config check:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      pass: process.env.EMAIL_PASS ? 'SET' : 'NOT SET'
    });

    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');
    
    const mailOptions = {
      from: `"CodeBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to CodeBuddy! 🚀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to CodeBuddy</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 10px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
            .feature { background: white; padding: 12px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #667eea; }
            @media only screen and (max-width: 600px) {
              .container { padding: 5px; }
              .header { padding: 15px; }
              .header h1 { font-size: 20px; }
              .content { padding: 15px; }
              .button { padding: 10px 20px; font-size: 14px; }
              .feature { padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to CodeBuddy!</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              <p>Welcome aboard! You've just joined Pakistan's #1 coding education platform. We're thrilled to have you on this learning journey.</p>
              
              <div class="feature">
                <strong>🎬 Free Video Tutorials</strong><br>
                Access 200+ free coding tutorials in Urdu/Hindi
              </div>
              
              <div class="feature">
                <strong>📚 Premium Courses</strong><br>
                Learn with structured courses and projects
              </div>
              
              <div class="feature">
                <strong>📝 Downloadable Notes</strong><br>
                Get PDF notes and cheat sheets
              </div>
              
              <div class="feature">
                <strong>🏆 Certificates</strong><br>
                Earn verified certificates on completion
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses" class="button">Start Learning Now</a>
              </p>
              
              <p>If you have any questions, feel free to reply to this email. We're here to help!</p>
              
              <p>Happy Coding!<br>Team CodeBuddy</p>
            </div>
            <div class="footer">
              <p>© 2024 CodeBuddy. All rights reserved.</p>
              <p>You received this email because you signed up for a CodeBuddy account.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', info.messageId);
    console.log('✅ Email preview URL:', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    console.error('❌ Full error:', error);
    return false;
  }
};

// Send Course Enrollment Email
const sendEnrollmentEmail = async (email, name, courseTitle) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"CodeBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎉 You're Enrolled: ${courseTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Course Enrollment</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .success-box { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Enrollment Successful!</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              
              <div class="success-box">
                <strong>Congratulations!</strong> You have been successfully enrolled in:
              </div>
              
              <h2 style="color: #11998e;">${courseTitle}</h2>
              
              <p>You can now access all course materials including:</p>
              <ul>
                <li>✅ Video lectures</li>
                <li>✅ Source code</li>
                <li>✅ Downloadable resources</li>
                <li>✅ Quizzes & assignments</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="button">Go to Dashboard</a>
              </p>
              
              <p>Start learning right away and build amazing projects!</p>
              
              <p>Best regards,<br>Team CodeBuddy</p>
            </div>
            <div class="footer">
              <p>© 2024 CodeBuddy. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Enrollment email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending enrollment email:', error);
    return false;
  }
};

// Send Password Reset Email
const sendPasswordResetEmail = async (email, name, resetUrl) => {
  try {
    console.log('📧 Sending password reset email to:', email);
    console.log('📧 Reset URL:', resetUrl);
    
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');
    
    const mailOptions = {
      from: `"CodeBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .warning-box { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              
              <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
              
              <div class="warning-box">
                <strong>⚠️ Important:</strong> This link will expire in 10 minutes.
              </div>
              
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </p>
              
              <p>Or copy and paste this link:</p>
              <p style="background: #eee; padding: 10px; word-break: break-all; font-size: 12px;">${resetUrl}</p>
              
              <p>If you have any issues, contact our support team.</p>
              
              <p>Best regards,<br>Team CodeBuddy</p>
            </div>
            <div class="footer">
              <p>© 2024 CodeBuddy. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    console.error('❌ Full error:', error);
    return false;
  }
};

// Send New Password Email
const sendNewPasswordEmail = async (email, name, newPassword) => {
  try {
    console.log('📧 Sending new password email to:', email);
    
    const transporter = createTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ Email transporter verified successfully');
    
    const mailOptions = {
      from: `"CodeBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your New Password - CodeBuddy',
      text: `Your New Password

Dear ${name},

Your password has been reset. Here is your new password:

${newPassword}

Please login with this new password and change it immediately for security.

Login at: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login

Best regards,
Team CodeBuddy`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your New Password</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .password-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 2px solid #667eea; text-align: center; }
            .password { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; }
            .warning-box { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔑 Your New Password</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              
              <p>Your password has been reset. Here is your new password:</p>
              
              <div class="password-box">
                <p class="password">${newPassword}</p>
              </div>
              
              <div class="warning-box">
                <strong>⚠️ Important:</strong> Please login with this new password and change it immediately for security.
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="button">Login Now</a>
              </p>
              
              <p>If you have any issues, contact our support team.</p>
              
              <p>Best regards,<br>Team CodeBuddy</p>
            </div>
            <div class="footer">
              <p>© 2024 CodeBuddy. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ New password email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending new password email:', error.message);
    console.error('❌ Full error:', error);
    return false;
  }
};

// Send New Course Announcement Email
const sendNewCourseEmail = async (email, name, courseTitle, courseDescription) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"CodeBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🆕 New Course Available: ${courseTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Course Announcement</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .new-badge { background: #ff6b6b; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🆕 New Course Alert!</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${name}</strong>,</p>
              
              <p>We're excited to announce a new course on CodeBuddy!</p>
              
              <span class="new-badge">NEW COURSE</span>
              
              <h2 style="color: #fa709a;">${courseTitle}</h2>
              
              <p>${courseDescription}</p>
              
              <p>Enroll now and start learning today!</p>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses" class="button">View Course</a>
              </p>
              
              <p>Keep learning and growing!<br>Team CodeBuddy</p>
            </div>
            <div class="footer">
              <p>© 2024 CodeBuddy. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`New course email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending new course email:', error);
    return false;
  }
};

// Send Contact Notification to Admin
const sendContactNotification = async (name, email, subject, message) => {
  try {
    console.log('📧 Sending contact notification to admin');
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to admin email
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      text: `New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Sent from CodeBuddy Contact Form`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #f5576c; }
            .message-box { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 1px solid #ddd; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📬 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <p>You have received a new message from the CodeBuddy contact form.</p>
              
              <div class="info-box">
                <strong>Name:</strong> ${name}<br>
                <strong>Email:</strong> <a href="mailto:${email}">${email}</a><br>
                <strong>Subject:</strong> ${subject}
              </div>
              
              <div class="message-box">
                <strong>Message:</strong>
                <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
              </div>
              
              <p style="text-align: center;">
                <a href="mailto:${email}" style="display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold;">Reply to ${name}</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2024 CodeBuddy. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Contact notification sent to admin');
    return true;
  } catch (error) {
    console.error('❌ Error sending contact notification:', error.message);
    return false;
  }
};

// Send Newsletter Subscription Confirmation
const sendNewsletterConfirmation = async (email) => {
  try {
    console.log('📧 Sending newsletter confirmation to:', email);
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to CodeBuddy Newsletter! 🎉',
      text: `Welcome to CodeBuddy Newsletter!

Thank you for subscribing to CodeBuddy newsletter. You'll now receive updates about:

- New course releases
- Free tutorials and resources
- Special discounts and offers
- Coding tips and tricks

Stay tuned for amazing content!

Best regards,
Team CodeBuddy`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to CodeBuddy Newsletter</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #11998e; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to CodeBuddy Newsletter!</h1>
            </div>
            <div class="content">
              <p>Thank you for subscribing to CodeBuddy newsletter!</p>
              
              <p>You'll now receive updates about:</p>
              
              <div class="feature">
                <strong>📚 New course releases</strong>
              </div>
              
              <div class="feature">
                <strong>🎬 Free tutorials and resources</strong>
              </div>
              
              <div class="feature">
                <strong>💰 Special discounts and offers</strong>
              </div>
              
              <div class="feature">
                <strong>💡 Coding tips and tricks</strong>
              </div>
              
              <p style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses" class="button">Start Learning Now</a>
              </p>
              
              <p>Stay tuned for amazing content!</p>
              
              <p>Best regards,<br>Team CodeBuddy</p>
            </div>
            <div class="footer">
              <p>© 2024 CodeBuddy. All rights reserved.</p>
              <p>You received this email because you subscribed to CodeBuddy newsletter.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Newsletter confirmation sent to:', email);
    return true;
  } catch (error) {
    console.error('❌ Error sending newsletter confirmation:', error.message);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendEnrollmentEmail,
  sendPasswordResetEmail,
  sendNewPasswordEmail,
  sendNewCourseEmail,
  sendContactNotification,
  sendNewsletterConfirmation
};
