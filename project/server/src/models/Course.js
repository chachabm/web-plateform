import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre de la leçon est requis'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  duration: {
    type: String,
    default: '0:00'
  },
  order: {
    type: Number,
    required: true
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  resources: [{
    name: String,
    type: {
      type: String,
      enum: ['pdf', 'doc', 'video', 'audio', 'other']
    },
    url: String,
    size: String
  }]
}, {
  timestamps: true
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre de la section est requis'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  lessons: [lessonSchema]
}, {
  timestamps: true
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre du cours est requis'],
    trim: true,
    maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'instructeur est requis']
  },
  thumbnail: {
    type: String,
    default: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2'
  },
  language: {
    type: String,
    required: [true, 'La langue est requise'],
    trim: true
  },
  level: {
    type: String,
    enum: ['Débutant', 'Intermédiaire', 'Avancé'],
    required: [true, 'Le niveau est requis']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    default: 0,
    min: [0, 'Le prix ne peut pas être négatif']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Le prix original ne peut pas être négatif']
  },
  discount: {
    type: Number,
    min: [0, 'La réduction ne peut pas être négative'],
    max: [100, 'La réduction ne peut pas dépasser 100%']
  },
  duration: {
    type: String,
    default: '0 heures'
  },
  sections: [sectionSchema],
  requirements: [{
    type: String,
    trim: true
  }],
  whatYouWillLearn: [{
    type: String,
    trim: true
  }],
  targetAudience: [{
    type: String,
    trim: true
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  isFree: {
    type: Boolean,
    default: true
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  // Champs pour les cours premium
  isPremium: {
    type: Boolean,
    default: false
  },
  revenue: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  refundCount: {
    type: Number,
    default: 0
  },
  couponCodes: [{
    code: {
      type: String,
      required: true,
      uppercase: true
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    validUntil: {
      type: Date
    },
    maxUses: {
      type: Number,
      default: 100
    },
    usedCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour la recherche et les performances
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ language: 1, level: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ price: 1 });
courseSchema.index({ isPremium: 1 });

// Virtual pour le nombre total de leçons
courseSchema.virtual('totalLessons').get(function() {
  return this.sections.reduce((total, section) => total + section.lessons.length, 0);
});

// Virtual pour la durée totale calculée
courseSchema.virtual('totalDuration').get(function() {
  let totalMinutes = 0;
  this.sections.forEach(section => {
    section.lessons.forEach(lesson => {
      if (lesson.duration) {
        const [minutes, seconds] = lesson.duration.split(':').map(Number);
        totalMinutes += minutes + (seconds / 60);
      }
    });
  });
  
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
});

// Middleware pour mettre à jour lastUpdated
courseSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Méthode pour calculer la note moyenne
courseSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }

  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.rating.average = Math.round((sum / this.reviews.length) * 10) / 10;
  this.rating.count = this.reviews.length;
};

// Méthode pour ajouter une review
courseSchema.methods.addReview = function(userId, rating, comment) {
  // Vérifier si l'utilisateur a déjà laissé une review
  const existingReview = this.reviews.find(review => 
    review.user.toString() === userId.toString()
  );

  if (existingReview) {
    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.createdAt = new Date();
  } else {
    this.reviews.push({
      user: userId,
      rating,
      comment
    });
  }

  this.calculateAverageRating();
};

// Méthode pour appliquer un coupon
courseSchema.methods.applyCoupon = function(couponCode) {
  const coupon = this.couponCodes.find(c => 
    c.code === couponCode.toUpperCase() && 
    c.isActive && 
    c.usedCount < c.maxUses &&
    (!c.validUntil || new Date(c.validUntil) > new Date())
  );

  if (!coupon) {
    return {
      valid: false,
      message: 'Coupon invalide ou expiré'
    };
  }

  const discountedPrice = this.price * (1 - coupon.discountPercentage / 100);
  
  return {
    valid: true,
    discountPercentage: coupon.discountPercentage,
    originalPrice: this.price,
    discountedPrice: Math.round(discountedPrice * 100) / 100,
    couponCode: coupon.code
  };
};

// Méthode pour enregistrer l'utilisation d'un coupon
courseSchema.methods.useCoupon = function(couponCode) {
  const couponIndex = this.couponCodes.findIndex(c => c.code === couponCode.toUpperCase());
  
  if (couponIndex !== -1) {
    this.couponCodes[couponIndex].usedCount += 1;
    
    // Désactiver le coupon s'il a atteint le nombre maximum d'utilisations
    if (this.couponCodes[couponIndex].usedCount >= this.couponCodes[couponIndex].maxUses) {
      this.couponCodes[couponIndex].isActive = false;
    }
    
    return true;
  }
  
  return false;
};

export default mongoose.model('Course', courseSchema);