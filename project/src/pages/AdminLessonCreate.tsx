import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Trash2, 
  Plus, 
  Video, 
  FileText, 
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Link as LinkIcon
} from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video' | 'audio' | 'other';
  url: string;
  size: string;
}

interface LessonFormData {
  title: string;
  description: string;
  courseId: string;
  sectionId: string;
  videoUrl: string;
  duration: string;
  resources: Resource[];
  isPreview: boolean;
  isPublished: boolean;
  transcript: string;
  order: number;
}

const AdminLessonCreate: React.FC = () => {
  const navigate = useNavigate();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    description: '',
    courseId: '',
    sectionId: '',
    videoUrl: '',
    duration: '00:00',
    resources: [],
    isPreview: false,
    isPublished: false,
    transcript: '',
    order: 1
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([
    { id: '1', title: 'Espagnol Complet pour Débutants' },
    { id: '2', title: 'Maîtrise de la Conversation Française' },
    { id: '3', title: 'Grammaire et Structure Allemandes' }
  ]);
  
  const [availableSections, setAvailableSections] = useState([
    { id: '1', courseId: '1', title: 'Introduction' },
    { id: '2', courseId: '1', title: 'Fondamentaux' },
    { id: '3', courseId: '1', title: 'Conversation' },
    { id: '4', courseId: '2', title: 'Introduction' },
    { id: '5', courseId: '2', title: 'Grammaire Avancée' },
    { id: '6', courseId: '3', title: 'Introduction' }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.courseId || !formData.sectionId) {
      setErrorMessage('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler une réponse réussie
      setSuccessMessage('Leçon créée avec succès !');
      
      // Rediriger vers la page de gestion des leçons après 2 secondes
      setTimeout(() => {
        navigate(`/admin/courses/${formData.courseId}/lessons`);
      }, 2000);
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors de la création de la leçon');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // Dans une application réelle, vous téléchargeriez le fichier et obtiendriez une URL
      // Pour cette démo, nous utilisons simplement un URL d'objet local
      setFormData({
        ...formData,
        videoUrl: URL.createObjectURL(file),
        duration: estimateVideoDuration(file.size)
      });
    }
  };

  const estimateVideoDuration = (fileSize: number): string => {
    // Estimation très approximative basée sur la taille du fichier
    // Supposons qu'un fichier de 10 Mo dure environ 1 minute
    const estimatedMinutes = Math.round(fileSize / (10 * 1024 * 1024));
    const minutes = Math.max(1, estimatedMinutes);
    return `${minutes.toString().padStart(2, '0')}:00`;
  };

  const handleResourceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = getFileType(file.name);
      const newResource: Resource = {
        id: Date.now().toString(),
        name: file.name,
        type: fileType,
        url: URL.createObjectURL(file),
        size: formatFileSize(file.size)
      };

      setFormData({
        ...formData,
        resources: [...formData.resources, newResource]
      });
    }
  };

  const getFileType = (fileName: string): Resource['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension || '')) return 'doc';
    if (['mp4', 'webm', 'avi', 'mov'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'ogg'].includes(extension || '')) return 'audio';
    return 'other';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const removeResource = (resourceId: string) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter(resource => resource.id !== resourceId)
    });
  };

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = e.target.value;
    setFormData({
      ...formData,
      courseId,
      sectionId: '' // Réinitialiser la section lorsque le cours change
    });
  };

  // Filtrer les sections en fonction du cours sélectionné
  const filteredSections = availableSections.filter(
    section => section.courseId === formData.courseId
  );

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
              <h1 className="text-2xl font-bold text-gray-900">Créer une Nouvelle Leçon</h1>
              <p className="text-gray-600">Ajoutez du contenu à vos cours</p>
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de la Leçon</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cours *
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={handleCourseChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Sélectionnez un cours</option>
                      {availableCourses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section *
                    </label>
                    <select
                      value={formData.sectionId}
                      onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                      disabled={!formData.courseId}
                    >
                      <option value="">Sélectionnez une section</option>
                      {filteredSections.map(section => (
                        <option key={section.id} value={section.id}>{section.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la Leçon *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    placeholder="Ex: Introduction à la Grammaire Espagnole"
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
                    placeholder="Décrivez le contenu de cette leçon..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vidéo de la Leçon
                  </label>
                  <div className="space-y-3">
                    {formData.videoUrl && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Video className="h-5 w-5 text-primary-600" />
                            <div>
                              <p className="font-medium text-gray-900">Vidéo téléchargée</p>
                              <p className="text-sm text-gray-500">Durée estimée: {formData.duration}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, videoUrl: '' })}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        ref={videoInputRef}
                        onChange={handleVideoUpload}
                        accept="video/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Télécharger une Vidéo</span>
                      </button>
                      <span className="text-sm text-gray-500">ou</span>
                      <div className="flex-1">
                        <input
                          type="url"
                          value={formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="URL de la vidéo (YouTube, Vimeo, etc.)"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée
                  </label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ex: 10:30"
                    />
                    <span className="text-sm text-gray-500">Format: minutes:secondes</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ressources
                    </label>
                    <input
                      type="file"
                      ref={resourceInputRef}
                      onChange={handleResourceUpload}
                      className="hidden"
                      multiple
                    />
                    <button
                      type="button"
                      onClick={() => resourceInputRef.current?.click()}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Ajouter une Ressource</span>
                    </button>
                  </div>

                  {formData.resources.length > 0 ? (
                    <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                      {formData.resources.map((resource) => (
                        <div key={resource.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="font-medium text-gray-900">{resource.name}</p>
                              <p className="text-xs text-gray-500">{resource.size}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeResource(resource.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Aucune ressource ajoutée</p>
                      <button
                        type="button"
                        onClick={() => resourceInputRef.current?.click()}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Télécharger des fichiers
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transcription (optionnel)
                  </label>
                  <textarea
                    value={formData.transcript}
                    onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ajoutez une transcription de la vidéo..."
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPreview}
                      onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Leçon de Prévisualisation</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Publier la Leçon</span>
                  </label>
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
                        <span>Créer la Leçon</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Options de la Leçon</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordre dans la Section
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Prévisualisation</h4>
                    <p className="text-sm text-gray-500">Permettre aux utilisateurs non inscrits de voir cette leçon</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPreview: !formData.isPreview })}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.isPreview 
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                        : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {formData.isPreview ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Publication</h4>
                    <p className="text-sm text-gray-500">Rendre la leçon visible aux étudiants</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                    className={`p-2 rounded-lg transition-colors ${
                      formData.isPublished 
                        ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {formData.isPublished ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guide de Création</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary-100 p-2 rounded-lg">
                    <Video className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Vidéo de Qualité</h4>
                    <p className="text-sm text-gray-600">Utilisez une vidéo claire avec un bon audio pour une meilleure expérience d'apprentissage.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-secondary-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Durée Optimale</h4>
                    <p className="text-sm text-gray-600">Visez des leçons de 5-15 minutes pour maintenir l'engagement des étudiants.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Ressources Utiles</h4>
                    <p className="text-sm text-gray-600">Ajoutez des documents complémentaires pour renforcer l'apprentissage.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <LinkIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Liens Pertinents</h4>
                    <p className="text-sm text-gray-600">Incluez des références et des liens vers des ressources externes.</p>
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

export default AdminLessonCreate;