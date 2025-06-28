import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  CheckCircle,
  XCircle,
  Tag,
  BookOpen,
  GraduationCap,
  Globe,
  Target
} from 'lucide-react';

interface CourseFormData {
  title: string;
  description: string;
  language: string;
  level: string;
  category: string;
  thumbnail: string;
  tags: string[];
  whatYouWillLearn: string[];
  requirements: string[];
  price: number;
  isFree: boolean;
}

const AdminCourseCreate: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    language: '',
    level: 'Débutant',
    category: 'Apprentissage des Langues',
    thumbnail: '',
    tags: [],
    whatYouWillLearn: [''],
    requirements: [''],
    price: 0,
    isFree: true
  });
  
  const [newTag, setNewTag] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.language) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler une réponse réussie
      setSuccessMessage('Cours créé avec succès !');
      
      // Rediriger vers la page d'édition du cours après 2 secondes
      setTimeout(() => {
        navigate('/admin/courses/new-course-id/edit');
      }, 2000);
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors de la création du cours');
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Créer un Nouveau Cours</h1>
              <p className="text-gray-600">Ajoutez un nouveau cours à la plateforme</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de Base</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      <option value="Débutant">Débutant</option>
                      <option value="Intermédiaire">Intermédiaire</option>
                      <option value="Avancé">Avancé</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="Apprentissage des Langues">Apprentissage des Langues</option>
                    <option value="Grammaire">Grammaire</option>
                    <option value="Conversation">Conversation</option>
                    <option value="Vocabulaire">Vocabulaire</option>
                    <option value="Prononciation">Prononciation</option>
                    <option value="Culture">Culture</option>
                  </select>
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

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
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
                        <span>Créer le Cours</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Options du Cours</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isFree}
                      onChange={(e) => setFormData({ ...formData, isFree: e.target.checked, price: e.target.checked ? 0 : formData.price })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700">Cours Gratuit</span>
                  </label>
                </div>

                {!formData.isFree && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prix (€)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guide de Création</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Titre Accrocheur</h4>
                    <p className="text-sm text-gray-600">Choisissez un titre clair qui décrit précisément le contenu du cours.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-secondary-100 p-2 rounded-lg">
                    <Target className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Objectifs Clairs</h4>
                    <p className="text-sm text-gray-600">Définissez ce que les étudiants apprendront dans votre cours.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Public Cible</h4>
                    <p className="text-sm text-gray-600">Précisez le niveau et les prérequis pour suivre votre cours.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Tag className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Tags Pertinents</h4>
                    <p className="text-sm text-gray-600">Ajoutez des tags pour améliorer la visibilité de votre cours.</p>
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

export default AdminCourseCreate;