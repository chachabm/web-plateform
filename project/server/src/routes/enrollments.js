import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Obtenir les inscriptions de l'utilisateur
// @route   GET /api/enrollments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        select: 'title thumbnail instructor language level rating',
        populate: {
          path: 'instructor',
          select: 'name avatar'
        }
      })
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error('Erreur récupération inscriptions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des inscriptions'
    });
  }
});

// @desc    Obtenir une inscription spécifique
// @route   GET /api/enrollments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name avatar'
        }
      });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Inscription non trouvée'
      });
    }

    // Vérifier que l'utilisateur est bien l'étudiant ou l'instructeur du cours
    if (
      enrollment.student.toString() !== req.user.id &&
      enrollment.course.instructor._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à cette inscription'
      });
    }

    res.json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    console.error('Erreur récupération inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'inscription'
    });
  }
});

// @desc    Mettre à jour la progression d'une leçon
// @route   PUT /api/enrollments/:id/progress
// @access  Private
router.put('/:id/progress', protect, async (req, res) => {
  try {
    const { lessonId, timeSpent, notes, currentPosition } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);

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
        message: 'Non autorisé à mettre à jour cette progression'
      });
    }

    // Mettre à jour la position actuelle
    if (currentPosition) {
      enrollment.progress.currentLesson = currentPosition;
    }

    // Marquer la leçon comme terminée si fournie
    if (lessonId) {
      enrollment.completeLesson(lessonId, timeSpent, notes);
    }

    // Calculer la progression
    await enrollment.calculateProgress();
    await enrollment.save();

    res.json({
      success: true,
      message: 'Progression mise à jour avec succès',
      data: enrollment.progress
    });
  } catch (error) {
    console.error('Erreur mise à jour progression:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la progression'
    });
  }
});

// @desc    Ajouter des notes à une leçon
// @route   PUT /api/enrollments/:id/notes
// @access  Private
router.put('/:id/notes', protect, async (req, res) => {
  try {
    const { lessonId, notes } = req.body;

    if (!lessonId || !notes) {
      return res.status(400).json({
        success: false,
        message: 'ID de leçon et notes requis'
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);

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
        message: 'Non autorisé à ajouter des notes'
      });
    }

    // Trouver la leçon dans les leçons complétées
    const lessonProgress = enrollment.progress.completedLessons.find(
      lesson => lesson.lessonId.toString() === lessonId
    );

    if (lessonProgress) {
      lessonProgress.notes = notes;
    } else {
      // Si la leçon n'est pas encore marquée comme complétée
      enrollment.progress.completedLessons.push({
        lessonId,
        notes,
        timeSpent: 0
      });
    }

    await enrollment.save();

    res.json({
      success: true,
      message: 'Notes ajoutées avec succès',
      data: enrollment.progress
    });
  } catch (error) {
    console.error('Erreur ajout notes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout des notes'
    });
  }
});

// @desc    Obtenir les étudiants inscrits à un cours (pour instructeurs)
// @route   GET /api/enrollments/course/:courseId
// @access  Private (Instructor/Admin)
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'instructeur du cours ou un admin
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à ces données'
      });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('student', 'name email avatar')
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    console.error('Erreur récupération étudiants:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des étudiants'
    });
  }
});

export default router;