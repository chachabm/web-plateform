import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  MoreVertical,
  Users,
  Star,
  Clock,
  Video,
  FileText,
  Download,
  Upload,
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockCourses } from '../data/mockData';

interface CourseFormData {
  id?: string;
  title: string;
  description: string;
  language: string;
  level: string;
  category: string;
  thumbnail: string;
  tags: string[];
  whatYouWillLearn: string[];
  requirements: string[];
}

const TeacherCourseManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filtrer les cours pour n'afficher que ceux de l'instructeur connecté
  const instructorCourses = mockCourses.filter(course => course.instructor === user?.name);
  
  const [courses, setCourses] = useState(instructorCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    language: '',
    level: 'Débutant',
    category: 'Apprentissage des Langues',
    thumbnail: '',
    tags: [],
    whatYouWillLearn: [''],
    requirements: ['']
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Filtrer les cours en fonction des critères de recherche
    const filteredCourses = instructorCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLanguage = !filterLanguage || course.language === filterLanguage;
      const matchesLevel = !filterLevel || course.level === filterLevel;
      
      return matchesSearch && matchesLanguage && matchesLevel;
    });
    
    setCourses(filteredCourses);
  }, [searchTerm, filterLanguage, filterLevel, instructorCourses]);

  const handleCreateCourse = () => {
    setFormData({
      title: '',
      description: '',
      language: '',
      level: 'Débutant',
      category: 'Apprentissage des Langues',
      thumbnail: '',
      tags: [],
      whatYouWillLearn: [''],
      requirements: ['']
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditCourse = (course: any) => {
    setFormData({
      id: course.id,
      title: course.title,
      description: course.description,
      language: course.language,
      level: course.level,
      category: course.category,
      thumbnail: course.thumbnail,
      tags: course.tags || [],
      whatYouWillLearn: course.whatYouWillLearn || ['Maîtriser les bases de la langue', 'Développer des compétences de conversation'],
      requirements: course.requirements || ['Aucun prérequis nécessaire']
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    setShowDeleteConfirm(courseId);
  };

  const confirmDeleteCourse = (courseId: string) => {
    // Simuler la suppression du cours
    setCourses(courses.filter(course => course.id !== courseId));
    setShowDeleteConfirm(null);
    
    // Afficher un message de succès
    setSuccessMessage('Cours supprimé avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      // Mettre à jour le cours existant
      setCourses(courses.map(course => 
        course.id === formData.id 
          ? { 
              ...course, 
              title: formData.title,
              description: formData.description,
              language: formData.language,
              level: formData.level,
              category: formData.category,
              thumbnail: formData.thumbnail,
              tags: formData.tags
            } 
          : course
      ));
      
      setSuccessMessage('Cours mis à jour avec succès');
    } else {
      // Créer un nouveau cours
      const newCourse = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        instructor: user?.name || 'Instructeur',
        instructorAvatar: user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
        thumbnail: formData.thumbnail || 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2',
        language: formData.language,
        level: formData.level as 'Débutant' | 'Intermédiaire' | 'Avancé',
        category: formData.category,
        rating: 0,
        reviewCount: 0,
        duration: '0 heures',
        lessons: 0,
        students: 0,
        tags: formData.tags
      };
      
      setCourses([...courses, newCourse]);
      setSuccessMessage('Cours créé avec succès');
    }
    
    setShowForm(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleAddWhatYouWillLearn = () => {
    setFormData({
      ...formData,
      whatYouWillLearn: [...formData.whatYouWillLearn, '']
    });
  };

  const handleUpdateWhatYouWillLearn = (index: number, value: string) => {
    const updatedItems = [...formData.whatYouWillLearn];
    updatedItems[index] = value;
    setFormData({
      ...formData,
      whatYouWillLearn: updatedItems
    });
  };

  const handleRemoveWhatYouWillLearn = (index: number) => {
    setFormData({
      ...formData,
      whatYouWillLearn: formData.whatYouWillLearn.filter((_, i) => i !== index)
    });
  };

  const handleAddRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const handleUpdateRequirement = (index: number, value: string) => {
    const updatedItems = [...formData.requirements];
    updatedItems[index] = value;
    setFormData({
      ...formData,
      requirements: updatedItems
    });
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    });
  };

  const languages = [...new Set(mockCourses.map(course => course.language))];
  const levels = ['Débutant', 'Intermédiaire', 'Avancé'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Cours</h1>
              <p className="text-gray-600">Créez et gérez vos cours d'enseignement</p>
            </div>
          </div>
          <button
            onClick={handleCreateCourse}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Créer un Cours</span>
          </button>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        {showForm ? (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Modifier le Cours' : 'Créer un Nouveau Cours'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du Cours *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  placeholder="Ex: Espagnol Complet pour Débutants"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  placeholder="Décrivez votre cours en détail..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue Enseignée *
                  </label>
                  <input
                    type="text"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    placeholder="Ex: Espagnol, Français, Japonais..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau *
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de Couverture
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="URL de l'image (laissez vide pour l'image par défaut)"
                  />
                  <button
                    type="button"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Parcourir</span>
                  </button>
                </div>
                {formData.thumbnail && (
                  <div className="mt-2">
                    <img
                      src={formData.thumbnail}
                      alt="Aperçu de la couverture"
                      className="h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&dpr=2';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ajouter un tag (ex: Grammaire, Vocabulaire...)"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-primary-800 hover:text-primary-900"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ce que les étudiants apprendront
                </label>
                <div className="space-y-2">
                  {formData.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateWhatYouWillLearn(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ex: Maîtriser les bases de la grammaire"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveWhatYouWillLearn(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddWhatYouWillLearn}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    + Ajouter un objectif d'apprentissage
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prérequis
                </label>
                <div className="space-y-2">
                  {formData.requirements.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateRequirement(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Ex: Aucun prérequis nécessaire"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    + Ajouter un prérequis
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-5 w-5" />
                  <span>{isEditing ? 'Mettre à jour' : 'Créer'} le Cours</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Filtres et Recherche */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Rechercher vos cours..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <select
                      value={filterLanguage}
                      onChange={(e) => setFilterLanguage(e.target.value)}
                      className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Toutes les langues</option>
                      {languages.map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="pl-4 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Tous les niveaux</option>
                      {levels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterLanguage('');
                      setFilterLevel('');
                    }}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Réinitialiser
                  </button>
                </div>
              </div>
            </div>

            {/* Liste des Cours */}
            <div className="space-y-6">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full md:w-48 h-32 object-cover rounded-lg mb-4 md:mb-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => navigate(`/course/${course.id}`)}
                                className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="Prévisualiser"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleEditCourse(course)}
                                className="p-2 text-gray-500 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors"
                                title="Modifier"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Supprimer"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                              <div className="relative group">
                                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                  <MoreVertical className="h-5 w-5" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                                  <button
                                    onClick={() => navigate(`/admin/courses/${course.id}/lessons`)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Video className="h-4 w-4 mr-3" />
                                    Gérer les Leçons
                                  </button>
                                  <button
                                    onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <FileText className="h-4 w-4 mr-3" />
                                    Éditer le Contenu
                                  </button>
                                  <button
                                    onClick={() => alert('Téléchargement des statistiques...')}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Download className="h-4 w-4 mr-3" />
                                    Exporter les Stats
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.lessons} leçons</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{course.students.toLocaleString()} étudiants</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span>{course.rating} ({course.reviewCount} avis)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration}</span>
                            </div>
                            <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
                              {course.level}
                            </span>
                            <span className="px-2 py-1 bg-secondary-100 text-secondary-800 rounded-full text-xs font-medium">
                              {course.language}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Confirmation de suppression */}
                    {showDeleteConfirm === course.id && (
                      <div className="p-4 bg-red-50 border-t border-red-200">
                        <div className="flex items-center justify-between">
                          <p className="text-red-800">
                            Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.
                          </p>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => confirmDeleteCourse(course.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Supprimer
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || filterLanguage || filterLevel 
                      ? 'Aucun cours ne correspond à vos critères' 
                      : 'Vous n\'avez pas encore créé de cours'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterLanguage || filterLevel 
                      ? 'Essayez de modifier vos filtres ou votre recherche' 
                      : 'Commencez à partager vos connaissances en créant votre premier cours'}
                  </p>
                  {searchTerm || filterLanguage || filterLevel ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterLanguage('');
                        setFilterLevel('');
                      }}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  ) : (
                    <button
                      onClick={handleCreateCourse}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <Plus className="h-5 w-5" />
                      <span>Créer mon premier cours</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherCourseManagement;