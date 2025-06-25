import nodemailer from 'nodemailer';

// Créer un transporteur réutilisable
const createTransporter = () => {
  // En développement, utiliser un service de test comme Ethereal
  if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.password'
      }
    });
  }

  // Configuration de production
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Envoyer un email
export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `LearnMe <${process.env.EMAIL_USER || 'noreply@learnme.com'}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé:', info.messageId);
    
    // Retourner l'URL de prévisualisation en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('URL de prévisualisation:', nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw error;
  }
};

// Email de bienvenue
export const sendWelcomeEmail = async (email, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #dc2626;">Bienvenue sur LearnMe !</h1>
      </div>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Bonjour ${name},</p>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Merci de vous être inscrit sur LearnMe, la plateforme d'apprentissage des langues en ligne.
        Nous sommes ravis de vous accueillir dans notre communauté d'apprenants !
      </p>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #dc2626; margin-top: 0;">Commencer votre parcours d'apprentissage</h3>
        <ul style="padding-left: 20px;">
          <li style="margin-bottom: 10px;">Explorez notre catalogue de cours</li>
          <li style="margin-bottom: 10px;">Inscrivez-vous à votre premier cours gratuitement</li>
          <li style="margin-bottom: 10px;">Suivez votre progression dans votre tableau de bord</li>
          <li style="margin-bottom: 10px;">Connectez-vous avec d'autres apprenants et instructeurs</li>
        </ul>
      </div>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter notre équipe de support.
      </p>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.CLIENT_URL}" style="display: inline-block; background-color: #dc2626; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
          Accéder à Votre Compte
        </a>
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
        Cordialement,<br>
        L'équipe LearnMe
      </p>
      
      <div style="border-top: 1px solid #e0e0e0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
        <p>
          Cet email a été envoyé à ${email}.<br>
          Si vous n'avez pas créé de compte sur LearnMe, veuillez ignorer cet email.
        </p>
        <p>
          LearnMe, 123 Rue de l'Apprentissage, Paris, 75001, France
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    email,
    subject: 'Bienvenue sur LearnMe !',
    html
  });
};

// Email de réinitialisation de mot de passe
export const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #dc2626;">Réinitialisation de Mot de Passe</h1>
      </div>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Bonjour,</p>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Vous avez demandé la réinitialisation de votre mot de passe sur LearnMe.
        Veuillez cliquer sur le bouton ci-dessous pour définir un nouveau mot de passe.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="display: inline-block; background-color: #dc2626; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
          Réinitialiser Mon Mot de Passe
        </a>
      </div>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Ce lien expirera dans 10 minutes pour des raisons de sécurité.
        Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
      </p>
      
      <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
        Cordialement,<br>
        L'équipe LearnMe
      </p>
      
      <div style="border-top: 1px solid #e0e0e0; margin-top: 30px; padding-top: 20px; text-align: center; font-size: 12px; color: #999;">
        <p>
          Cet email a été envoyé à ${email}.<br>
          Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    email,
    subject: 'Réinitialisation de Mot de Passe - LearnMe',
    html
  });
};

// Email de confirmation d'inscription à un cours
export const sendCourseEnrollmentEmail = async (email, name, course) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #dc2626;">Inscription Confirmée !</h1>
      </div>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">Bonjour ${name},</p>
      
      <p style="font-size: 16px; line-height: 1.5; color: #333;">
        Félicitations ! Vous êtes maintenant inscrit au cours <strong>${course.title}</strong>.
        Vous pouvez commencer à apprendre dès maintenant.
      </p>
      
      <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #dc2626; margin-top: 0;">Détails du Cours</h3>
        <ul style="padding-left: 20px;">
          <li style="margin-bottom: 10px;"><strong>Cours :</strong> ${course.title}</li>
          <li style="margin-bottom: 10px;"><strong>Instructeur :</strong> ${course.instructor.name}</li>
          <li style="margin-bottom: 10px;"><strong>Niveau :</strong> ${course.level}</li>
          <li style="margin-bottom: 10px;"><strong>Langue :</strong> ${course.language}</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="${process.env.CLIENT_URL}/course/${course._id}/learn" style="display: inline-block; background-color: #dc2626; color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">
          Commencer à Apprendre
        </a>
      </div>
      
      <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
        Bonne chance dans votre parcours d'apprentissage !<br>
        L'équipe LearnMe
      </p>
    </div>
  `;

  return sendEmail({
    email,
    subject: `Inscription Confirmée : ${course.title}`,
    html
  });
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendCourseEnrollmentEmail
};