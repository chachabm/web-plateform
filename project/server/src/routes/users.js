import express from 'express';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateProfile } from '../middleware/validation.js';

const router = express.Router();

// @desc    Obtenir le profil de l'utilisateur
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

// @desc    Mettre à jour le profil de l'utilisateur
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, validateProfile, async (req, res) => {
  try {
    const {
      name,
      bio,
      languages,
      location,
      website,
      preferences
    } = req.body;

    const updateData = {};
    
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (languages) updateData.languages = languages;
    if (location) updateData.location = location;
    if (website) updateData.website = website;
    if (preferences) updateData.preferences = preferences;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
});

// @desc    Mettre à jour l'avatar de l'utilisateur
// @route   PUT /api/users/avatar
// @access  Private
router.put('/avatar', protect, async (req, res) => {
  try {
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({
        success: false,
        message: 'URL d\'avatar requise'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Avatar mis à jour avec succès',
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Erreur mise à jour avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'avatar'
    });
  }
});

// @desc    Obtenir les statistiques de l'utilisateur
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    let stats = {};

    if (user.role === 'learner') {
      // Statistiques pour les apprenants
      const enrollments = await Enrollment.find({ student: user._id });
      
      stats = {
        coursesEnrolled: enrollments.length,
        coursesCompleted: enrollments.filter(e => e.isCompleted).length,
        totalHours: enrollments.reduce((total, e) => total + (e.progress.totalTimeSpent || 0), 0),
        averageProgress: enrollments.length > 0 
          ? enrollments.reduce((total, e) => total + e.progress.completionPercentage, 0) / enrollments.length 
          : 0,
        certificates: enrollments.filter(e => e.certificateIssued).length
      };
    } else if (user.role === 'instructor') {
      // Statistiques pour les instructeurs
      const courses = await Course.find({ instructor: user._id });
      const totalStudents = courses.reduce((total, course) => total + course.enrollmentCount, 0);
      
      stats = {
        coursesCreated: courses.length,
        totalStudents,
        averageRating: courses.length > 0 
          ? courses.reduce((total, course) => total + course.rating.average, 0) / courses.length 
          : 0,
        totalReviews: courses.reduce((total, course) => total + course.rating.count, 0),
        publishedCourses: courses.filter(c => c.isPublished).length
      };
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Erreur récupération stats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// @desc    Obtenir les cours créés par l'instructeur
// @route   GET /api/users/courses
// @access  Private (Instructor)
router.get('/courses', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Erreur récupération cours instructeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des cours'
    });
  }
});

// @desc    Obtenir les utilisateurs (admin)
// @route   GET /api/users
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      sort = 'newest'
    } = req.query;

    // Construire la requête de filtre
    const filter = {};

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    if (role) {
      filter.role = role;
    }

    // Définir l'ordre de tri
    let sortOption = {};
    switch (sort) {
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'role':
        sortOption = { role: 1, name: 1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    // Calculer la pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Exécuter la requête
    const users = await User.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password');

    // Compter le total pour la pagination
    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
});

export default router;