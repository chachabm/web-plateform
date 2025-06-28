import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  HelpCircle,
  Clock,
  Award,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  BarChart
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  timeLimit: number;
  passingScore: number;
  questionCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  attempts: number;
  averageScore: number;
}

const QuizManager: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [availableCourses, setAvailableCourses] = useState([
    { id: '1', title: 'Espagnol Complet pour Débutants' },
    { id: '2', title: 'Maîtrise de la Conversation Française' },
    { id: '3', title: 'Grammaire et Structure Allemandes' }
  ]);

  // Simuler le chargement des quiz depuis l'API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // En mode démo, utiliser des données fictives
        const mockQuizzes: Quiz[] = [
          {
            id: '1',
            title: 'Quiz de Vocabulaire Espagnol - Niveau Débutant',
            description: 'Testez vos connaissances des mots et expressions de base en espagnol',
            courseId: '1',
            courseName: 'Espagnol Complet pour Débutants',
            timeLimit: 10,
            passingScore: 70,
            questionCount: 10,
            isPublished: true,
            createdAt: '2025-01-10T14:30:00Z',
            updatedAt: '2025-01-12T09:15:00Z',
            attempts: 156,
            averageScore: 75
          },
          {
            id: '2',
            title: 'Quiz de Grammaire Française - Temps Verbaux',
            description: 'Évaluez votre maîtrise des temps verbaux en français',
            courseId: '2',
            courseName: 'Maîtrise de la Conversation Française',
            timeLimit: 15,
            passingScore: 80,
            questionCount: 15,
            isPublished: true,
            createdAt: '2025-01-05T10:20:00Z',
            updatedAt: '2025-01-05T10:20:00Z',
            attempts: 89,
            averageScore: 68
          },
          {
            id: '3',
            title: 'Test de Prononciation Allemande',
            description: 'Vérifiez votre compréhension des règles de prononciation allemande',
            courseId: '3',
            courseName: 'Grammaire et Structure Allemandes',
            timeLimit: 8,
            passingScore: 60,
            questionCount: 8,
            isPublished: false,
            createdAt: '2025-01-15T16:45:00Z',
            updatedAt: '2025-01-15T16:45:00Z',
            attempts: 0,
            averageScore: 0
          }
        ];
        
        setQuizzes(mockQuizzes);
        setFilteredQuizzes(mockQuizzes);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des quiz:', error);
        setErrorMessage('Erreur lors du chargement des quiz');
        setIsLoading(false);
      }
    };
    
    fetchQuizzes();
  }, []);

  // Filtrer les quiz en fonction des critères de recherche
  useEffect(() => {
    const filtered = quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = courseFilter === '' || quiz.courseId === courseFilter;
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'published' && quiz.isPublished) ||
                           (statusFilter === 'draft' && !quiz.isPublished);
      
      return matchesSearch && matchesCourse && matchesStatus;
    });
    
    setFilteredQuizzes(filtered);
  }, [quizzes, searchTerm, courseFilter, statusFilter]);

  const handleCreateQuiz = () => {
    navigate('/admin/quizzes/new');
  };

  const handleEditQuiz = (quizId: string) => {
    navigate(`/admin/quizzes/${quizId}/edit`);
  };

  const handlePreviewQuiz = (quizId: string) => {
    navigate(`/admin/quizzes/${quizId}/preview`);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setShowDeleteConfirm(quizId);
  };

  const confirmDeleteQuiz = (quizId: string) => {
    // Simuler la suppression du quiz
    setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
    setSuccessMessage('Quiz supprimé avec succès');
    setShowDeleteConfirm(null);
    
    // Effacer le message de succès après 3 secondes
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleTogglePublish = (quizId: string) => {
    setQuizzes(quizzes.map(quiz => 
      quiz.id === quizId ? { ...quiz, isPublished: !quiz.isPublished } : quiz
    ));
    
    const quiz = quizzes.find(q => q.id === quizId);
    setSuccessMessage(`Quiz ${quiz?.isPublished ? 'dépublié' : 'publié'} avec succès`);
    
    // Effacer le message de succès après 3 secondes
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleViewResults = (quizId: string) => {
    navigate(`/admin/quizzes/${quizId}/results`);
  };

  if (!user || (user.role !== 'instructor' && user.role !== 'admin')) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Quiz</h1>
              <p className="text-gray-600">Créez et gérez des quiz pour évaluer vos apprenants</p>
            </div>
          </div>
          <button
            onClick={handleCreateQuiz}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Créer un Quiz</span>
          </button>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            {errorMessage}
          </div>
        )}

        {/* Filtres et Recherche */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher des quiz..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative">
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="">Tous les cours</option>
                  {availableCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publiés</option>
                  <option value="draft">Brouillons</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCourseFilter('');
                  setStatusFilter('all');
                }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Liste des Quiz */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des quiz...</p>
            </div>
          ) : filteredQuizzes.length > 0 ? (
            filteredQuizzes.map(quiz => (
              <div key={quiz.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-gray-900">{quiz.title}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            quiz.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {quiz.isPublished ? 'Publié' : 'Brouillon'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{quiz.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <FileText className="h-4 w-4" />
                          <span>{quiz.questionCount} questions</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.timeLimit} minutes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4" />
                          <span>Score de réussite: {quiz.passingScore}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{quiz.attempts} tentatives</span>
                        </div>
                        {quiz.attempts > 0 && (
                          <div className="flex items-center space-x-1">
                            <BarChart className="h-4 w-4" />
                            <span>Score moyen: {quiz.averageScore}%</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        <span>Cours: {quiz.courseName}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handlePreviewQuiz(quiz.id)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Prévisualiser"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditQuiz(quiz.id)}
                        className="p-2 text-gray-500 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleTogglePublish(quiz.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          quiz.isPublished 
                            ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
                            : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={quiz.isPublished ? 'Dépublier' : 'Publier'}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                      {quiz.attempts > 0 && (
                        <button
                          onClick={() => handleViewResults(quiz.id)}
                          className="bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                        >
                          Voir les résultats
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun quiz trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || courseFilter || statusFilter !== 'all'
                  ? 'Essayez de modifier vos filtres ou votre recherche'
                  : 'Commencez à créer des quiz pour évaluer vos apprenants'}
              </p>
              {searchTerm || courseFilter || statusFilter !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCourseFilter('');
                    setStatusFilter('all');
                  }}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              ) : (
                <button
                  onClick={handleCreateQuiz}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  <span>Créer votre premier quiz</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
              <p className="text-gray-700 mb-6">
                Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible et supprimera également toutes les tentatives et résultats associés.
              </p>
              <div className="flex items-center space-x-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => showDeleteConfirm && confirmDeleteQuiz(showDeleteConfirm)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManager;