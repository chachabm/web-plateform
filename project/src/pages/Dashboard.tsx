import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock, 
  Calendar, 
  Play, 
  Users, 
  Star, 
  Video, 
  GraduationCap, 
  Settings, 
  MessageCircle 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockCourses } from '../data/mockData';
import UpcomingSessions from '../components/Dashboard/UpcomingSessions';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Mock data for user progress
  const enrolledCourses = mockCourses.slice(0, 3);
  const recentActivity = [
    { id: 1, type: 'lesson', title: 'Spanish Basics - Lesson 5', time: '2 hours ago', progress: 75 },
    { id: 2, type: 'quiz', title: 'French Grammar Quiz', time: '1 day ago', score: 85 },
    { id: 3, type: 'lesson', title: 'German Pronunciation', time: '2 days ago', progress: 60 },
  ];

  const stats = {
    coursesCompleted: 3,
    hoursLearned: 45,
    currentStreak: 7,
    certificates: 2
  };

  const upcomingSessions = [
    {
      id: 1,
      title: 'Spanish Pronunciation Workshop',
      date: '2025-01-20',
      time: '14:00',
      participants: 12,
      maxParticipants: 25
    },
    {
      id: 2,
      title: 'French Grammar Q&A',
      date: '2025-01-22',
      time: '16:30',
      participants: 8,
      maxParticipants: 20
    }
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'instructor':
        return <Users className="h-8 w-8" />;
      case 'admin':
        return <Settings className="h-8 w-8" />;
      default:
        return <GraduationCap className="h-8 w-8" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'from-secondary-600 to-yellow-600';
      case 'admin':
        return 'from-primary-600 to-red-600';
      default:
        return 'from-primary-600 to-secondary-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'Formateur';
      case 'admin':
        return 'Administrateur';
      default:
        return 'Apprenant';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'Créez et gérez vos cours, organisez des sessions vidéo';
      case 'admin':
        return 'Gérez les utilisateurs, les contenus et le tableau de bord';
      default:
        return 'Suivez et évaluez vos cours, rejoignez des sessions vidéo';
    }
  };

  // Contenu spécifique au rôle
  const renderRoleSpecificContent = () => {
    if (user?.role === 'admin') {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Gestion de la Plateforme</h2>
            <Link
              to="/admin"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Tableau de Bord Admin
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <Users className="h-8 w-8 text-primary-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Gestion des Utilisateurs</h3>
              <p className="text-sm text-gray-600 mb-3">
                Gérez les comptes étudiants et formateurs
              </p>
              <Link
                to="/admin"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Accéder →
              </Link>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <BookOpen className="h-8 w-8 text-secondary-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Gestion des Contenus</h3>
              <p className="text-sm text-gray-600 mb-3">
                Supervisez et approuvez les cours
              </p>
              <Link
                to="/admin"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Accéder →
              </Link>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
              <TrendingUp className="h-8 w-8 text-success-600 mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Statistiques</h3>
              <p className="text-sm text-gray-600 mb-3">
                Analysez les performances de la plateforme
              </p>
              <Link
                to="/admin"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Accéder →
              </Link>
            </div>
          </div>
        </div>
      );
    } else if (user?.role === 'instructor') {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mes Cours</h2>
            <Link
              to="/teacher/courses"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Gérer Tous Mes Cours
            </Link>
          </div>

          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors">
                <div className="flex items-start space-x-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">Créé par vous</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students} étudiants</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{course.rating}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span>Gratuit</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/courses/${course.id}/edit`}
                      className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors text-sm"
                    >
                      Éditer
                    </Link>
                    <Link
                      to={`/admin/courses/${course.id}/lessons`}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <Video className="h-4 w-4" />
                      <span>Leçons</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mes Cours</h2>
            <Link
              to="/courses"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Explorer Plus
            </Link>
          </div>

          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors">
                <div className="flex items-start space-x-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{course.rating}</span>
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progression</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/course/${course.id}/learn`}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Continuer</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with User Role */}
        <div className="mb-8">
          <div className={`bg-gradient-to-r ${getRoleColor(user?.role || 'learner')} rounded-xl p-6 text-white mb-6`}>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                {getRoleIcon(user?.role || 'learner')}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold">
                  Bienvenue, {user?.name}!
                </h1>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {getRoleLabel(user?.role || 'learner')}
                  </span>
                  <span className="text-white/80">
                    {getRoleDescription(user?.role || 'learner')}
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user?.role === 'admin' ? (
            <>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Utilisateurs</p>
                    <p className="text-2xl font-bold text-gray-900">1,250</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cours</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                  <div className="bg-secondary-100 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-secondary-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Formateurs</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                  </div>
                  <div className="bg-success-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-success-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Croissance</p>
                    <p className="text-2xl font-bold text-gray-900">+12.5%</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          ) : user?.role === 'instructor' ? (
            <>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cours Créés</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Heures d'Enseignement</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.hoursLearned}</p>
                  </div>
                  <div className="bg-secondary-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-secondary-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Étudiants Actifs</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                  <div className="bg-success-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-success-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Note Moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Star className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cours Complétés</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</p>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Heures d'Apprentissage</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.hoursLearned}</p>
                  </div>
                  <div className="bg-secondary-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-secondary-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Série Actuelle</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.currentStreak} jours</p>
                  </div>
                  <div className="bg-success-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-success-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Certificats</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Role-specific content */}
            {renderRoleSpecificContent()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sessions Vidéo */}
            <UpcomingSessions />

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Activité Récente</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'lesson' ? 'bg-primary-100' : 'bg-secondary-100'
                    }`}>
                      {activity.type === 'lesson' ? (
                        <Play className={`h-4 w-4 ${
                          activity.type === 'lesson' ? 'text-primary-600' : 'text-secondary-600'
                        }`} />
                      ) : (
                        <Award className="h-4 w-4 text-secondary-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      {activity.progress && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-primary-600 h-1 rounded-full"
                              style={{ width: `${activity.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      {activity.score && (
                        <p className="text-xs text-success-600 font-medium mt-1">
                          Score: {activity.score}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions Rapides</h2>
              <div className="space-y-3">
                {user?.role === 'admin' ? (
                  <>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Users className="h-5 w-5 text-primary-600" />
                      <span className="font-medium text-gray-900">Gérer les Utilisateurs</span>
                    </Link>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <BookOpen className="h-5 w-5 text-secondary-600" />
                      <span className="font-medium text-gray-900">Gérer les Contenus</span>
                    </Link>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Settings className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-gray-900">Paramètres Plateforme</span>
                    </Link>
                  </>
                ) : user?.role === 'instructor' ? (
                  <>
                    <Link
                      to="/teacher/courses"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <BookOpen className="h-5 w-5 text-primary-600" />
                      <span className="font-medium text-gray-900">Gérer Mes Cours</span>
                    </Link>
                    <Link
                      to="/video-sessions"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Video className="h-5 w-5 text-secondary-600" />
                      <span className="font-medium text-gray-900">Sessions Vidéo</span>
                    </Link>
                    <Link
                      to="/messages"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 text-success-600" />
                      <span className="font-medium text-gray-900">Messagerie</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/courses"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <BookOpen className="h-5 w-5 text-primary-600" />
                      <span className="font-medium text-gray-900">Explorer les Cours</span>
                    </Link>
                    <Link
                      to="/course/1/quiz"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Play className="h-5 w-5 text-secondary-600" />
                      <span className="font-medium text-gray-900">Faire un Quiz</span>
                    </Link>
                    <Link
                      to="/messages"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 text-success-600" />
                      <span className="font-medium text-gray-900">Contacter un Formateur</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;