import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number, // en minutes
    default: 0
  },
  notes: {
    type: String,
    trim: true
  }
});

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'étudiant est requis']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Le cours est requis']
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    completedLessons: [progressSchema],
    currentLesson: {
      sectionIndex: {
        type: Number,
        default: 0
      },
      lessonIndex: {
        type: Number,
        default: 0
      }
    },
    totalTimeSpent: {
      type: Number, // en minutes
      default: 0
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateIssuedAt: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true,
    maxlength: [1000, 'La review ne peut pas dépasser 1000 caractères']
  },
  reviewedAt: Date,
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'dropped'],
    default: 'active'
  },
  // Champs de paiement
  paymentId: {
    type: String
  },
  paymentAmount: {
    type: Number,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  refunded: {
    type: Boolean,
    default: false
  },
  refundId: {
    type: String
  },
  refundReason: {
    type: String
  },
  refundDate: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composé pour éviter les doublons
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ enrolledAt: -1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ paymentStatus: 1 });

// Virtual pour calculer le pourcentage de progression
enrollmentSchema.virtual('progressPercentage').get(function() {
  return this.progress.completionPercentage;
});

// Méthode pour marquer une leçon comme terminée
enrollmentSchema.methods.completeLesson = function(lessonId, timeSpent = 0, notes = '') {
  // Vérifier si la leçon n'est pas déjà terminée
  const existingProgress = this.progress.completedLessons.find(
    progress => progress.lessonId.toString() === lessonId.toString()
  );

  if (!existingProgress) {
    this.progress.completedLessons.push({
      lessonId,
      timeSpent,
      notes,
      completedAt: new Date()
    });

    this.progress.totalTimeSpent += timeSpent;
    this.lastAccessedAt = new Date();
  }
};

// Méthode pour calculer le pourcentage de progression
enrollmentSchema.methods.calculateProgress = async function() {
  await this.populate('course');
  
  if (!this.course) return 0;

  const totalLessons = this.course.sections.reduce((total, section) => 
    total + section.lessons.length, 0
  );

  if (totalLessons === 0) return 0;

  const completedLessons = this.progress.completedLessons.length;
  const percentage = Math.round((completedLessons / totalLessons) * 100);
  
  this.progress.completionPercentage = percentage;

  // Marquer comme terminé si 100%
  if (percentage === 100 && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
    this.status = 'completed';
  }

  return percentage;
};

// Méthode pour obtenir la prochaine leçon
enrollmentSchema.methods.getNextLesson = async function() {
  await this.populate('course');
  
  if (!this.course) return null;

  const { sectionIndex, lessonIndex } = this.progress.currentLesson;
  const sections = this.course.sections;

  // Vérifier si nous sommes à la fin
  if (sectionIndex >= sections.length) return null;

  const currentSection = sections[sectionIndex];
  
  // Si nous avons terminé toutes les leçons de cette section
  if (lessonIndex >= currentSection.lessons.length) {
    // Passer à la section suivante
    if (sectionIndex + 1 < sections.length) {
      this.progress.currentLesson.sectionIndex = sectionIndex + 1;
      this.progress.currentLesson.lessonIndex = 0;
      return sections[sectionIndex + 1].lessons[0];
    }
    return null; // Cours terminé
  }

  return currentSection.lessons[lessonIndex];
};

// Middleware pour mettre à jour lastAccessedAt
enrollmentSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastAccessedAt = new Date();
  }
  next();
});

export default mongoose.model('Enrollment', enrollmentSchema);