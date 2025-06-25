import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Créer une session de paiement Stripe
// @route   POST /api/payments/create-checkout-session
// @access  Private
router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'ID du cours requis'
      });
    }

    // Récupérer les informations du cours
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier si l'utilisateur est déjà inscrit
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà inscrit à ce cours'
      });
    }

    // Créer la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: course.title,
              description: course.description.substring(0, 255),
              images: [course.thumbnail],
            },
            unit_amount: Math.round(course.price * 100), // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId: courseId,
        userId: req.user.id
      },
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/course/${courseId}/learn?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/course/${courseId}?canceled=true`,
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Erreur création session de paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la session de paiement'
    });
  }
});

// @desc    Webhook Stripe pour traiter les événements de paiement
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Erreur webhook Stripe:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer l'événement
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Récupérer les métadonnées
      const { courseId, userId } = session.metadata;
      
      try {
        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
          console.error('Utilisateur non trouvé:', userId);
          break;
        }
        
        // Vérifier si le cours existe
        const course = await Course.findById(courseId);
        if (!course) {
          console.error('Cours non trouvé:', courseId);
          break;
        }
        
        // Vérifier si l'inscription existe déjà
        const existingEnrollment = await Enrollment.findOne({
          student: userId,
          course: courseId
        });
        
        if (existingEnrollment) {
          console.log('Inscription existante trouvée');
          break;
        }
        
        // Créer l'inscription
        const enrollment = await Enrollment.create({
          student: userId,
          course: courseId,
          paymentId: session.id,
          paymentAmount: session.amount_total / 100, // Convertir les centimes en euros
          paymentStatus: 'completed'
        });
        
        // Incrémenter le compteur d'inscriptions du cours
        course.enrollmentCount += 1;
        await course.save();
        
        console.log('Inscription créée avec succès:', enrollment._id);
      } catch (error) {
        console.error('Erreur traitement paiement réussi:', error);
      }
      break;
      
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.error('Échec du paiement:', paymentIntent.id, paymentIntent.last_payment_error?.message);
      break;
      
    default:
      // Événement inattendu
      console.log(`Événement Stripe non géré: ${event.type}`);
  }

  // Retourner une réponse 200 pour confirmer la réception
  res.status(200).json({ received: true });
});

// @desc    Obtenir l'historique des paiements de l'utilisateur
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    // Récupérer les inscriptions avec paiement
    const enrollments = await Enrollment.find({
      student: req.user.id,
      paymentId: { $exists: true }
    })
    .populate('course', 'title thumbnail')
    .sort({ createdAt: -1 });
    
    const paymentHistory = enrollments.map(enrollment => ({
      id: enrollment._id,
      courseId: enrollment.course._id,
      courseTitle: enrollment.course.title,
      courseThumbnail: enrollment.course.thumbnail,
      amount: enrollment.paymentAmount,
      status: enrollment.paymentStatus,
      date: enrollment.createdAt
    }));
    
    res.json({
      success: true,
      data: paymentHistory
    });
  } catch (error) {
    console.error('Erreur récupération historique paiements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'historique des paiements'
    });
  }
});

// @desc    Créer un remboursement
// @route   POST /api/payments/refund
// @access  Private
router.post('/refund', protect, async (req, res) => {
  try {
    const { enrollmentId, reason } = req.body;
    
    if (!enrollmentId) {
      return res.status(400).json({
        success: false,
        message: 'ID d\'inscription requis'
      });
    }
    
    // Récupérer l'inscription
    const enrollment = await Enrollment.findById(enrollmentId);
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée'
      });
    }
    
    // Vérifier que l'utilisateur est bien l'étudiant
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à demander un remboursement pour cette inscription'
      });
    }
    
    // Vérifier que l'inscription a un paiement
    if (!enrollment.paymentId) {
      return res.status(400).json({
        success: false,
        message: 'Aucun paiement associé à cette inscription'
      });
    }
    
    // Vérifier que le remboursement n'a pas déjà été effectué
    if (enrollment.refunded) {
      return res.status(400).json({
        success: false,
        message: 'Ce paiement a déjà été remboursé'
      });
    }
    
    // Créer le remboursement dans Stripe
    const refund = await stripe.refunds.create({
      payment_intent: enrollment.paymentId,
      reason: 'requested_by_customer'
    });
    
    // Mettre à jour l'inscription
    enrollment.refunded = true;
    enrollment.refundId = refund.id;
    enrollment.refundReason = reason;
    enrollment.refundDate = new Date();
    await enrollment.save();
    
    res.json({
      success: true,
      message: 'Remboursement traité avec succès',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Erreur création remboursement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du remboursement'
    });
  }
});

export default router;