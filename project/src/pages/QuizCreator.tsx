import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Clock,
  Award,
  FileText,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizFormData {
  id?: string;
  title: string;
  description: string;
  courseId: string;
  timeLimit: number; // en minutes
  passingScore: number; // pourcentage
  isPublished: boolean;
  questions: QuizQuestion[];
}

const QuizCreator: React.FC = () => {
  const { courseId } = useParams<{ courseId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<QuizFormData>({
    title: '',
    description: '',
    courseId: courseId || '',
    timeLimit: 10,
    passingScore: 70,
    isPublished: false,
    questions: []
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([
    { id: '1', title: 'Espagnol Complet pour Débutants' },
    { id: '2', title: 'Maîtrise de la Conversation Française' },
    { id: '3', title: 'Grammaire et Structure Allemandes' }
  ]);
  
  // Si un courseId est fourni, sélectionnez-le automatiquement
  useEffect(() => {
    if (courseId) {
      setFormData(prev => ({ ...prev, courseId }));
    }
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.courseId || formData.questions.length === 0) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires et ajouter au moins une question');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler une réponse réussie
      setSuccessMessage('Quiz créé avec succès !');
      
      // Rediriger vers la page du cours après 2 secondes
      setTimeout(() => {
        navigate(`/admin/courses/${formData.courseId}/edit`);
      }, 2000);
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors de la création du quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    const options = [...updatedQuestions[questionIndex].options];
    options[optionIndex] = value;
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options.push('');
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...formData.questions];
    const options = [...updatedQuestions[questionIndex].options];
    
    // Ne pas supprimer si c'est la réponse correcte ou s'il n'y a que 2 options
    if (optionIndex === updatedQuestions[questionIndex].correctAnswer || options.length <= 2) {
      return;
    }
    
    // Ajuster l'index de la réponse correcte si nécessaire
    let correctAnswer = updatedQuestions[questionIndex].correctAnswer;
    if (optionIndex < correctAnswer) {
      correctAnswer--;
    }
    
    options.splice(optionIndex, 1);
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options,
      correctAnswer
    };
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
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
              <h1 className="text-2xl font-bold text-gray-900">Créer un Quiz</h1>
              <p className="text-gray-600">Ajoutez un quiz pour évaluer les connaissances des apprenants</p>
            </div>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations du Quiz</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre du Quiz *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    placeholder="Ex: Quiz de Grammaire Espagnole - Niveau Débutant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Décrivez l'objectif de ce quiz et ce qu'il évalue..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cours Associé *
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez un cours</option>
                    {availableCourses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limite de Temps (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.timeLimit}
                      onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                      min="1"
                      max="120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Score de Réussite (%)
                    </label>
                    <input
                      type="number"
                      value={formData.passingScore}
                      onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublished" className="text-sm text-gray-700">
                    Publier immédiatement
                  </label>
                </div>

                {/* Questions du Quiz */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-1 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ajouter une Question</span>
                    </button>
                  </div>

                  {formData.questions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-4">Aucune question ajoutée</p>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Ajouter votre première question
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.questions.map((question, questionIndex) => (
                        <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Question {questionIndex + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeQuestion(questionIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question *
                              </label>
                              <input
                                type="text"
                                value={question.question}
                                onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                                placeholder="Ex: Quelle est la traduction correcte de 'Bonjour' en espagnol ?"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Options *
                                </label>
                                {question.options.length < 6 && (
                                  <button
                                    type="button"
                                    onClick={() => addOption(questionIndex)}
                                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                  >
                                    + Ajouter une option
                                  </button>
                                )}
                              </div>

                              <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      checked={question.correctAnswer === optionIndex}
                                      onChange={() => updateQuestion(questionIndex, 'correctAnswer', optionIndex)}
                                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                                      required
                                    />
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                      placeholder={`Option ${optionIndex + 1}`}
                                      required
                                    />
                                    {question.options.length > 2 && (
                                      <button
                                        type="button"
                                        onClick={() => removeOption(questionIndex, optionIndex)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Explication (affichée après la réponse)
                              </label>
                              <textarea
                                value={question.explanation}
                                onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                                rows={2}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Expliquez pourquoi cette réponse est correcte..."
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || formData.questions.length === 0}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Création en cours...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span>Créer le Quiz</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu du Quiz</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Nombre de questions</span>
                  <span className="font-medium">{formData.questions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Temps alloué</span>
                  <span className="font-medium">{formData.timeLimit} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Score de réussite</span>
                  <span className="font-medium">{formData.passingScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    formData.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.isPublished ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Conseils pour Créer un Bon Quiz</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <HelpCircle className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Questions Claires</h4>
                    <p className="text-sm text-gray-600">Formulez des questions précises et sans ambiguïté.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-secondary-100 p-2 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Distracteurs Plausibles</h4>
                    <p className="text-sm text-gray-600">Créez des options incorrectes mais crédibles pour tester la compréhension.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Temps Approprié</h4>
                    <p className="text-sm text-gray-600">Accordez suffisamment de temps pour réfléchir sans précipitation.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Explications Utiles</h4>
                    <p className="text-sm text-gray-600">Fournissez des explications pour aider les apprenants à comprendre leurs erreurs.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;