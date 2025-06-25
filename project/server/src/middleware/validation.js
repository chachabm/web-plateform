import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors.array()
    });
  }
  next();
};

export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  
  body('role')
    .optional()
    .isIn(['learner', 'instructor', 'admin'])
    .withMessage('Rôle invalide'),
  
  handleValidationErrors
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis'),
  
  handleValidationErrors
];

export const validateCourse = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Le titre doit contenir entre 5 et 200 caractères'),
  
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('La description doit contenir entre 20 et 2000 caractères'),
  
  body('language')
    .trim()
    .notEmpty()
    .withMessage('La langue est requise'),
  
  body('level')
    .isIn(['Débutant', 'Intermédiaire', 'Avancé'])
    .withMessage('Niveau invalide'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('La catégorie est requise'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être positif'),
  
  handleValidationErrors
];

export const validateMessage = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Le message doit contenir entre 1 et 2000 caractères'),
  
  body('recipient')
    .isMongoId()
    .withMessage('ID destinataire invalide'),
  
  body('course')
    .optional()
    .isMongoId()
    .withMessage('ID cours invalide'),
  
  handleValidationErrors
];

export const validateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La bio ne peut pas dépasser 500 caractères'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La localisation ne peut pas dépasser 100 caractères'),
  
  body('website')
    .optional()
    .isURL()
    .withMessage('URL de site web invalide'),
  
  handleValidationErrors
];