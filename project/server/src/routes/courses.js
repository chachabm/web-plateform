import express from 'express';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { validateCourse } from '../middleware/validation.js';

const router = express.Router();

// @desc    Obtenir tous les cours
// @route   GET /api/courses
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      language,
      level,
      category,
      sort = 'popular',
      instructor
    } = req.query;

    // Construire la requête de filtre
    const filter = { isPublished: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (language && language !== 'Toutes les Catégories') {
      filter.language = language;
    }

    if (level && level !== 'Tous les Niveaux') {
      filter.level = level;
    }

    if (category) {
      filter.category = new RegExp(category, 'i');
    }

    if (instructor) {
      filter.instructor = instructor;
    }

    // Définir l'ordre de tri
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      case 'alphabetical':
        sortOption = { title: 1 };
        break;
      case 'popular':
      default:
        sortOption = { enrollmentCount: -1, 'rating.average': -1 };
        break;
    }

    // Calculer la pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Exécuter la requête
    const courses = await Course.find(filter)
      .populate('instructor', 'name avatar bio')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Compter le total pour la pagination
    const total = await Course.countDocuments(filter);

    // Ajouter des informations d'inscription pour l'utilisateur connecté
    if (req.user) {
      const enrollments = await Enrollment.find({
        student: req.user.id,
        course: { $in: courses.map(c => c._id) }
      }).lean();

      const enrollmentMap = enrollments.reduce((acc, enrollment) => {
        acc[enrollment.course.toString()] = enrollment;
        return acc;
      }, {});

      courses.forEach(course => {
        course.isEnrolled = !!enrollmentMap[course._id.toString()];
        course.enrollment = enrollmentMap[course._id.toString()] || null;
      });
    }

    res.json({
      success: true,
      data: courses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des cours'
    });
  }
});

// @desc    Obtenir un cours spécifique
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio')
      .populate('reviews.user', 'name avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier si l'utilisateur est inscrit
    let enrollment = null;
    if (req.user) {
      enrollment = await Enrollment.findOne({
        student: req.user.id,
        course: course._id
      });
    }

    const courseData = course.toObject();
    courseData.isEnrolled = !!enrollment;
    courseData.enrollment = enrollment;

    res.json({
      success: true,
      data: courseData
    });
  } catch (error) {
    console.error('Erreur récupération cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du cours'
    });
  }
});

// @desc    Créer un nouveau cours
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), validateCourse, async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor: req.user.id
    };

    const course = await Course.create(courseData);
    await course.populate('instructor', 'name avatar bio');

    res.status(201).json({
      success: true,
      message: 'Cours créé avec succès',
      data: course
    });
  } catch (error) {
    console.error('Erreur création cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du cours'
    });
  }
});

// @desc    Mettre à jour un cours
// @route   PUT /api/courses/:id
// @access  Private (Instructor/Admin)
router.put('/:id', protect, authorize('instructor', 'admin'), validateCourse, async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier que l'instructeur peut modifier ce cours
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier ce cours'
      });
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor', 'name avatar bio');

    res.json({
      success: true,
      message: 'Cours mis à jour avec succès',
      data: course
    });
  } catch (error) {
    console.error('Erreur mise à jour cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du cours'
    });
  }
});

// @desc    Supprimer un cours
// @route   DELETE /api/courses/:id
// @access  Private (Instructor/Admin)
router.delete('/:id', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier que l'instructeur peut supprimer ce cours
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce cours'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Cours supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du cours'
    });
  }
});

// @desc    S'inscrire à un cours
// @route   POST /api/courses/:id/enroll
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier si l'utilisateur est déjà inscrit
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: course._id
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà inscrit à ce cours'
      });
    }

    // Créer l'inscription
    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: course._id
    });

    // Incrémenter le compteur d'inscriptions du cours
    course.enrollmentCount += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Inscription au cours réussie',
      data: enrollment
    });
  } catch (error) {
    console.error('Erreur inscription cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription au cours'
    });
  }
});

// @desc    Ajouter une review à un cours
// @route   POST /api/courses/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La note doit être entre 1 et 5'
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier si l'utilisateur est inscrit au cours
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: course._id
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Vous devez être inscrit au cours pour laisser une review'
      });
    }

    // Ajouter la review
    course.addReview(req.user.id, rating, comment);
    await course.save();

    // Mettre à jour l'inscription
    enrollment.rating = rating;
    enrollment.review = comment;
    enrollment.reviewedAt = new Date();
    await enrollment.save();

    await course.populate('reviews.user', 'name avatar');

    res.json({
      success: true,
      message: 'Review ajoutée avec succès',
      data: course.reviews
    });
  } catch (error) {
    console.error('Erreur ajout review:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la review'
    });
  }
});

// @desc    Obtenir les sections et leçons d'un cours
// @route   GET /api/courses/:id/curriculum
// @access  Private (si inscrit) ou Public (si preview)
router.get('/:id/curriculum', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .select('sections title instructor');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier si l'utilisateur est inscrit
    let isEnrolled = false;
    let progress = null;

    if (req.user) {
      const enrollment = await Enrollment.findOne({
        student: req.user.id,
        course: course._id
      });

      isEnrolled = !!enrollment;
      progress = enrollment ? enrollment.progress : null;
    }

    // Si l'utilisateur n'est pas inscrit, ne montrer que les leçons preview
    if (!isEnrolled && req.user?.id !== course.instructor.toString() && req.user?.role !== 'admin') {
      course.sections.forEach(section => {
        section.lessons = section.lessons.filter(lesson => lesson.isPreview);
      });
    }

    res.json({
      success: true,
      data: {
        curriculum: course.sections,
        isEnrolled,
        progress
      }
    });
  } catch (error) {
    console.error('Erreur récupération curriculum:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du curriculum'
    });
  }
});

// @desc    Marquer une leçon comme terminée
// @route   POST /api/courses/:id/lessons/:lessonId/complete
// @access  Private
router.post('/:id/lessons/:lessonId/complete', protect, async (req, res) => {
  try {
    const { timeSpent, notes } = req.body;

    // Vérifier si l'utilisateur est inscrit
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.id
    });

    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'Vous devez être inscrit au cours pour marquer une leçon comme terminée'
      });
    }

    // Marquer la leçon comme terminée
    enrollment.completeLesson(req.params.lessonId, timeSpent, notes);
    
    // Calculer la progression
    await enrollment.calculateProgress();
    await enrollment.save();

    res.json({
      success: true,
      message: 'Leçon marquée comme terminée',
      data: {
        progress: enrollment.progress,
        isCompleted: enrollment.isCompleted
      }
    });
  } catch (error) {
    console.error('Erreur marquage leçon:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de la leçon'
    });
  }
});

export default router;