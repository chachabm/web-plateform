import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email templates
const getWelcomeEmailTemplate = (user) => {
  const roleSpecificContent = {
    learner: {
      title: 'Welcome to Your Learning Journey!',
      subtitle: 'Start exploring thousands of language courses',
      features: [
        'Access to premium language courses',
        'Interactive video lessons with native speakers',
        'Progress tracking and certificates',
        'Community support and practice groups'
      ],
      cta: 'Browse Courses',
      ctaLink: `${process.env.CLIENT_URL}/courses`
    },
    instructor: {
      title: 'Welcome to the Teaching Community!',
      subtitle: 'Share your knowledge and inspire learners worldwide',
      features: [
        'Create and publish your own courses',
        'Advanced analytics and student insights',
        'Live video session tools',
        'Revenue tracking and payouts'
      ],
      cta: 'Create Your First Course',
      ctaLink: `${process.env.CLIENT_URL}/admin/courses/new`
    },
    admin: {
      title: 'Welcome to LearnMe Administration!',
      subtitle: 'Manage the platform and oversee operations',
      features: [
        'Full platform management access',
        'User and course administration',
        'Analytics and reporting tools',
        'System configuration controls'
      ],
      cta: 'Access Admin Panel',
      ctaLink: `${process.env.CLIENT_URL}/admin`
    }
  };

  const content = roleSpecificContent[user.role] || roleSpecificContent.learner;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to LearnMe</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8fafc;
            }
            .container {
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #dc2626 0%, #f59e0b 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .content {
                padding: 40px 30px;
            }
            .welcome-title {
                font-size: 28px;
                font-weight: bold;
                color: #1f2937;
                margin-bottom: 10px;
                text-align: center;
            }
            .welcome-subtitle {
                font-size: 16px;
                color: #6b7280;
                text-align: center;
                margin-bottom: 30px;
            }
            .user-info {
                background: #f3f4f6;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
            }
            .role-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .role-learner { background: #fef3c7; color: #d97706; }
            .role-instructor { background: #fee2e2; color: #dc2626; }
            .role-admin { background: #fee2e2; color: #dc2626; }
            .features {
                margin: 30px 0;
            }
            .features h3 {
                color: #1f2937;
                margin-bottom: 15px;
            }
            .feature-list {
                list-style: none;
                padding: 0;
            }
            .feature-list li {
                padding: 8px 0;
                padding-left: 25px;
                position: relative;
            }
            .feature-list li:before {
                content: "✓";
                position: absolute;
                left: 0;
                color: #10b981;
                font-weight: bold;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #dc2626 0%, #f59e0b 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                text-align: center;
                margin: 20px 0;
                transition: transform 0.2s;
            }
            .cta-button:hover {
                transform: translateY(-2px);
            }
            .footer {
                background: #f9fafb;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e5e7eb;
            }
            .footer p {
                margin: 5px 0;
                color: #6b7280;
                font-size: 14px;
            }
            .social-links {
                margin: 20px 0;
            }
            .social-links a {
                display: inline-block;
                margin: 0 10px;
                color: #6b7280;
                text-decoration: none;
            }
            @media (max-width: 600px) {
                body { padding: 10px; }
                .content { padding: 30px 20px; }
                .header { padding: 30px 20px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📚 LearnMe</div>
                <p>Master Languages Online</p>
            </div>
            
            <div class="content">
                <h1 class="welcome-title">${content.title}</h1>
                <p class="welcome-subtitle">${content.subtitle}</p>
                
                <div class="user-info">
                    <h3>Account Details</h3>
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Role:</strong> <span class="role-badge role-${user.role}">${user.role}</span></p>
                    <p><strong>Joined:</strong> ${new Date(user.joinedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                </div>
                
                <div class="features">
                    <h3>What's included with your account:</h3>
                    <ul class="feature-list">
                        ${content.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div style="text-align: center;">
                    <a href="${content.ctaLink}" class="cta-button">${content.cta}</a>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <h4 style="margin: 0 0 10px 0; color: #d97706;">Getting Started Tips:</h4>
                    <ul style="margin: 0; padding-left: 20px; color: #d97706;">
                        ${user.role === 'learner' ? `
                            <li>Complete your profile to get personalized course recommendations</li>
                            <li>Start with a beginner course if you're new to the language</li>
                            <li>Join our community forums to practice with other learners</li>
                        ` : user.role === 'instructor' ? `
                            <li>Set up your instructor profile with your expertise and experience</li>
                            <li>Create your first course using our easy-to-use course builder</li>
                            <li>Schedule live sessions to engage directly with your students</li>
                        ` : `
                            <li>Familiarize yourself with the admin dashboard and tools</li>
                            <li>Review platform analytics and user engagement metrics</li>
                            <li>Set up automated reports and monitoring systems</li>
                        `}
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Need help getting started?</strong></p>
                <p>Visit our <a href="${process.env.CLIENT_URL}/help" style="color: #dc2626;">Help Center</a> or contact our support team at <a href="mailto:support@learnme.com" style="color: #dc2626;">support@learnme.com</a></p>
                
                <div class="social-links">
                    <a href="#">Facebook</a> |
                    <a href="#">Twitter</a> |
                    <a href="#">Instagram</a> |
                    <a href="#">YouTube</a>
                </div>
                
                <p style="margin-top: 20px; font-size: 12px;">
                    This email was sent to ${user.email}. If you didn't create an account with LearnMe, please ignore this email.
                </p>
                <p style="font-size: 12px;">
                    © 2025 LearnMe. All rights reserved. | 
                    <a href="${process.env.CLIENT_URL}/privacy" style="color: #6b7280;">Privacy Policy</a> | 
                    <a href="${process.env.CLIENT_URL}/terms" style="color: #6b7280;">Terms of Service</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send welcome email
export const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'LearnMe',
        address: process.env.EMAIL_USER || 'noreply@learnme.com'
      },
      to: user.email,
      subject: `Welcome to LearnMe, ${user.name}! 🎉`,
      html: getWelcomeEmailTemplate(user),
      // Text fallback
      text: `
        Welcome to LearnMe, ${user.name}!
        
        Thank you for joining our language learning community. Your account has been successfully created.
        
        Account Details:
        - Name: ${user.name}
        - Email: ${user.email}
        - Role: ${user.role}
        - Joined: ${new Date(user.joinedDate).toLocaleDateString()}
        
        Get started by visiting: ${process.env.CLIENT_URL}
        
        If you need any help, contact us at support@learnme.com
        
        Best regards,
        The LearnMe Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send course enrollment confirmation
export const sendEnrollmentConfirmation = async (user, course) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: 'LearnMe',
        address: process.env.EMAIL_USER || 'noreply@learnme.com'
      },
      to: user.email,
      subject: `Enrollment Confirmed: ${course.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Enrollment Confirmed! 🎉</h2>
          <p>Hi ${user.name},</p>
          <p>You have successfully enrolled in <strong>${course.title}</strong>.</p>
          <p>Start learning now: <a href="${process.env.CLIENT_URL}/course/${course.id}/learn">Begin Course</a></p>
          <p>Best regards,<br>The LearnMe Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Enrollment confirmation sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending enrollment confirmation:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const transporter = createTransporter();
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: 'LearnMe',
        address: process.env.EMAIL_USER || 'noreply@learnme.com'
      },
      to: user.email,
      subject: 'Password Reset Request - LearnMe',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>You requested a password reset for your LearnMe account.</p>
          <p>Click the link below to reset your password:</p>
          <p><a href="${resetUrl}" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The LearnMe Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('Email configuration error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendWelcomeEmail,
  sendEnrollmentConfirmation,
  sendPasswordResetEmail,
  testEmailConfiguration
};