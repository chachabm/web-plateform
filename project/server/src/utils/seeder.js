import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import Message from '../models/Message.js';
import connectDB from '../config/database.js';

// Charger les variables d'environnement
dotenv.config();

// Connecter à la base de données
connectDB();

// Données de démonstration
const users = [
  {
    name: 'Admin User',
    email: 'admin@learnme.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'Maria Rodriguez',
    email: 'maria@learnme.com',
    password: 'password123',
    role: 'instructor',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Professeur d\'espagnol avec 10 ans d\'expérience. Spécialisée dans l\'enseignement aux débutants.',
    languages: ['Espagnol', 'Anglais', 'Français'],
    location: 'Madrid, Espagne',
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'Pierre Dubois',
    email: 'pierre@learnme.com',
    password: 'password123',
    role: 'instructor',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    bio: 'Professeur de français natif avec une passion pour la culture et la littérature françaises.',
    languages: ['Français', 'Anglais', 'Espagnol'],
    location: 'Paris, France',
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'Jean Dupont',
    email: 'jean@example.com',
    password: 'password123',
    role: 'learner',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    languages: ['Français', 'Anglais'],
    location: 'Lyon, France',
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'Sophie Martin',
    email: 'sophie@example.com',
    password: 'password123',
    role: 'learner',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    languages: ['Français', 'Anglais'],
    location: 'Bordeaux, France',
    isEmailVerified: true,
    isActive: true
  }
];

// Fonction pour importer les données
const importData = async () => {
  try {
    // Supprimer les données existantes
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await Message.deleteMany();

    console.log('🗑️ Données existantes supprimées');

    // Créer les utilisateurs
    const createdUsers = await User.create(users);
    console.log(`👤 ${createdUsers.length} utilisateurs créés`);

    const adminUser = createdUsers[0];
    const mariaUser = createdUsers[1];
    const pierreUser = createdUsers[2];
    const jeanUser = createdUsers[3];
    const sophieUser = createdUsers[4];

    // Créer les cours
    const courses = [
      {
        title: 'Espagnol Complet pour Débutants',
        description: 'Apprenez l\'espagnol à partir de zéro avec des leçons interactives, des exercices pratiques et de l\'audio de locuteurs natifs.',
        instructor: mariaUser._id,
        thumbnail: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2',
        language: 'Espagnol',
        level: 'Débutant',
        category: 'Apprentissage des Langues',
        tags: ['Espagnol', 'Débutant', 'Grammaire', 'Vocabulaire'],
        price: 0,
        duration: '25 heures',
        isPublished: true,
        isPopular: true,
        isBestseller: true,
        isFree: true,
        enrollmentCount: 15420,
        rating: {
          average: 4.8,
          count: 2547
        },
        sections: [
          {
            title: 'Introduction',
            order: 1,
            lessons: [
              {
                title: 'Bienvenue au Cours',
                description: 'Introduction au cours et ce que vous allez apprendre',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                duration: '5:30',
                order: 1,
                isPreview: true,
                isPublished: true
              },
              {
                title: 'Aperçu du Cours',
                description: 'Aperçu de la structure du cours et du parcours d\'apprentissage',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                duration: '8:15',
                order: 2,
                isPreview: true,
                isPublished: true
              }
            ]
          },
          {
            title: 'Fondamentaux',
            order: 2,
            lessons: [
              {
                title: 'Alphabet et Prononciation',
                description: 'Apprendre l\'alphabet espagnol et les règles de prononciation de base',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
                duration: '12:45',
                order: 1,
                isPreview: false,
                isPublished: true
              },
              {
                title: 'Salutations et Présentations',
                description: 'Salutations courantes en espagnol et comment se présenter',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                duration: '15:20',
                order: 2,
                isPreview: false,
                isPublished: true
              }
            ]
          }
        ]
      },
      {
        title: 'Maîtrise de la Conversation Française',
        description: 'Maîtrisez les compétences de conversation française avec des scénarios du monde réel et la pratique de la prononciation.',
        instructor: pierreUser._id,
        thumbnail: 'https://images.pexels.com/photos/4195342/pexels-photo-4195342.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2',
        language: 'Français',
        level: 'Intermédiaire',
        category: 'Apprentissage des Langues',
        tags: ['Français', 'Conversation', 'Prononciation', 'Intermédiaire'],
        price: 0,
        duration: '18 heures',
        isPublished: true,
        isPopular: true,
        isFree: true,
        enrollmentCount: 8920,
        rating: {
          average: 4.7,
          count: 1823
        },
        sections: [
          {
            title: 'Introduction',
            order: 1,
            lessons: [
              {
                title: 'Bienvenue au Cours',
                description: 'Introduction au cours de conversation française',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
                duration: '4:30',
                order: 1,
                isPreview: true,
                isPublished: true
              }
            ]
          },
          {
            title: 'Conversations de Base',
            order: 2,
            lessons: [
              {
                title: 'Au Café',
                description: 'Vocabulaire et expressions pour commander au café',
                videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
                duration: '10:15',
                order: 1,
                isPreview: false,
                isPublished: true
              }
            ]
          }
        ]
      }
    ];

    const createdCourses = await Course.create(courses);
    console.log(`📚 ${createdCourses.length} cours créés`);

    // Créer les inscriptions
    const enrollments = [
      {
        student: jeanUser._id,
        course: createdCourses[0]._id,
        progress: {
          completedLessons: [
            {
              lessonId: createdCourses[0].sections[0].lessons[0]._id,
              timeSpent: 5,
              notes: 'Très bonne introduction au cours'
            }
          ],
          currentLesson: {
            sectionIndex: 0,
            lessonIndex: 1
          },
          totalTimeSpent: 5,
          completionPercentage: 25
        }
      },
      {
        student: sophieUser._id,
        course: createdCourses[1]._id,
        progress: {
          completedLessons: [
            {
              lessonId: createdCourses[1].sections[0].lessons[0]._id,
              timeSpent: 4,
              notes: 'Bonne introduction à la conversation française'
            }
          ],
          currentLesson: {
            sectionIndex: 1,
            lessonIndex: 0
          },
          totalTimeSpent: 4,
          completionPercentage: 50
        }
      }
    ];

    const createdEnrollments = await Enrollment.create(enrollments);
    console.log(`📝 ${createdEnrollments.length} inscriptions créées`);

    // Créer les messages
    const messages = [
      {
        sender: jeanUser._id,
        recipient: mariaUser._id,
        content: 'Bonjour Maria, j\'ai une question sur la prononciation des verbes en espagnol.',
        course: createdCourses[0]._id,
        isRead: true,
        readAt: new Date()
      },
      {
        sender: mariaUser._id,
        recipient: jeanUser._id,
        content: 'Bonjour Jean, bien sûr ! Quelle est votre question spécifique ?',
        course: createdCourses[0]._id,
        isRead: false
      },
      {
        sender: sophieUser._id,
        recipient: pierreUser._id,
        content: 'Bonjour Pierre, pourriez-vous me recommander des ressources supplémentaires pour pratiquer la conversation française ?',
        course: createdCourses[1]._id,
        isRead: true,
        readAt: new Date()
      },
      {
        sender: pierreUser._id,
        recipient: sophieUser._id,
        content: 'Bonjour Sophie, je vous recommande de regarder des films français avec sous-titres et d\'écouter des podcasts français. Je peux vous envoyer une liste si vous le souhaitez.',
        course: createdCourses[1]._id,
        isRead: false
      }
    ];

    const createdMessages = await Message.create(messages);
    console.log(`💬 ${createdMessages.length} messages créés`);

    console.log('✅ Importation des données terminée');
    process.exit();
  } catch (error) {
    console.error('❌ Erreur importation des données:', error);
    process.exit(1);
  }
};

// Fonction pour supprimer les données
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Course.deleteMany();
    await Enrollment.deleteMany();
    await Message.deleteMany();

    console.log('🗑️ Toutes les données ont été supprimées');
    process.exit();
  } catch (error) {
    console.error('❌ Erreur suppression des données:', error);
    process.exit(1);
  }
};

// Exécuter la fonction appropriée selon l'argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}