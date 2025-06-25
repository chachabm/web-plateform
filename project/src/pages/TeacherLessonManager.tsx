import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  GripVertical, 
  Video, 
  FileText, 
  Clock,
  Save,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { mockCourses } from '../data/mockData';
import LessonEditor from '../components/Course/LessonEditor';

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video' | 'audio' | 'other';
  url: string;
  size: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  resources: Resource[];
  isPreview: boolean;
  isPublished: boolean;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

const TeacherLessonManager: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const course = mockCourses.find(c => c.id === courseId);
  
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Introduction',
      order: 1,
      lessons: [
        {
          id: '1',
          title: 'Bienvenue au Cours',
          description: 'Introduction au cours et ce que vous allez apprendre',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          duration: '5:30',
          resources: [
            { id: '1', name: 'Programme du Cours.pdf', type: 'pdf', url: '#', size: '2.5 MB' },
            { id: '2', name: 'Liste de Vocabulaire.doc', type: 'doc', url: '#', size: '1.2 MB' }
          ],
          isPreview: true,
          isPublished: true
        },
        {
          id: '2',
          title: 'Aperçu du Cours',
          description: 'Aperçu de la structure du cours et du parcours d\'apprentissage',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
          duration: '8:15',
          resources: [],
          isPreview: false,
          isPublished: true
        }
      ]
    },
    {
      id: '2',
      title: 'Fondamentaux',
      order: 2,
      lessons: [
        {
          id: '3',
          title: 'Concepts de Base',
          description: 'Apprendre les concepts fondamentaux',
          videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
          duration: '15:20',
          resources: [],
          isPreview: false,
          isPublished: false
        }
      ]
    }
  ]);

  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState('');
  const [showLessonEditor, setShowLessonEditor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: 'section' | 'lesson', id: string, sectionId?: string} | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cours Non Trouvé</h1>
          <button
            onClick={() => navigate('/teacher/courses')}
            className="text-primary-600 hover:text-primary-700"
          >
            Retour à Mes Cours
          </button>
        </div>
      </div>
    );
  }

  const handleAddSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: 'Nouvelle Section',
      order: sections.length + 1,
      lessons: []
    };
    
    setSections([...sections, newSection]);
    setEditingSectionId(newSection.id);
    setEditingSectionTitle('Nouvelle Section');
    
    // Afficher un message de succès
    setSuccessMessage('Section ajoutée avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditSectionTitle = (sectionId: string, title: string) => {
    setEditingSectionId(sectionId);
    setEditingSectionTitle(title);
  };

  const handleSaveSectionTitle = () => {
    if (!editingSectionId) return;
    
    setSections(sections.map(section => 
      section.id === editingSectionId 
        ? { ...section, title: editingSectionTitle } 
        : section
    ));
    
    setEditingSectionId(null);
    setEditingSectionTitle('');
    
    // Afficher un message de succès
    setSuccessMessage('Titre de section mis à jour');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteSection = (sectionId: string) => {
    setShowDeleteConfirm({
      type: 'section',
      id: sectionId
    });
  };

  const handleAddLesson = (sectionId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: 'Nouvelle Leçon',
      description: '',
      videoUrl: '',
      duration: '0:00',
      resources: [],
      isPreview: false,
      isPublished: false
    };
    
    setEditingLesson(newLesson);
    setEditingSectionId(sectionId);
    setShowLessonEditor(true);
  };

  const handleEditLesson = (lesson: Lesson, sectionId: string) => {
    setEditingLesson(lesson);
    setEditingSectionId(sectionId);
    setShowLessonEditor(true);
  };

  const handleSaveLesson = (updatedLesson: Lesson) => {
    if (!editingSectionId) return;
    
    const sectionIndex = sections.findIndex(section => section.id === editingSectionId);
    if (sectionIndex === -1) return;
    
    const section = sections[sectionIndex];
    const lessonIndex = section.lessons.findIndex(lesson => lesson.id === updatedLesson.id);
    
    const updatedSections = [...sections];
    
    if (lessonIndex === -1) {
      // Nouvelle leçon
      updatedSections[sectionIndex] = {
        ...section,
        lessons: [...section.lessons, updatedLesson]
      };
    } else {
      // Mise à jour d'une leçon existante
      const updatedLessons = [...section.lessons];
      updatedLessons[lessonIndex] = updatedLesson;
      updatedSections[sectionIndex] = {
        ...section,
        lessons: updatedLessons
      };
    }
    
    setSections(updatedSections);
    setShowLessonEditor(false);
    setEditingLesson(null);
    setEditingSectionId(null);
    
    // Afficher un message de succès
    setSuccessMessage('Leçon enregistrée avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteLesson = (lessonId: string, sectionId: string) => {
    setShowDeleteConfirm({
      type: 'lesson',
      id: lessonId,
      sectionId
    });
  };

  const confirmDelete = () => {
    if (!showDeleteConfirm) return;
    
    if (showDeleteConfirm.type === 'section') {
      setSections(sections.filter(section => section.id !== showDeleteConfirm.id));
      setSuccessMessage('Section supprimée avec succès');
    } else if (showDeleteConfirm.type === 'lesson' && showDeleteConfirm.sectionId) {
      const sectionIndex = sections.findIndex(section => section.id === showDeleteConfirm.sectionId);
      if (sectionIndex !== -1) {
        const updatedSections = [...sections];
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          lessons: updatedSections[sectionIndex].lessons.filter(lesson => lesson.id !== showDeleteConfirm.id)
        };
        setSections(updatedSections);
        setSuccessMessage('Leçon supprimée avec succès');
      }
    }
    
    setShowDeleteConfirm(null);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const toggleLessonPublished = (lessonId: string, sectionId: string) => {
    const sectionIndex = sections.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) return;
    
    const section = sections[sectionIndex];
    const lessonIndex = section.lessons.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) return;
    
    const updatedSections = [...sections];
    const updatedLessons = [...section.lessons];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      isPublished: !updatedLessons[lessonIndex].isPublished
    };
    
    updatedSections[sectionIndex] = {
      ...section,
      lessons: updatedLessons
    };
    
    setSections(updatedSections);
  };

  const toggleLessonPreview = (lessonId: string, sectionId: string) => {
    const sectionIndex = sections.findIndex(section => section.id === sectionId);
    if (sectionIndex === -1) return;
    
    const section = sections[sectionIndex];
    const lessonIndex = section.lessons.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex === -1) return;
    
    const updatedSections = [...sections];
    const updatedLessons = [...section.lessons];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      isPreview: !updatedLessons[lessonIndex].isPreview
    };
    
    updatedSections[sectionIndex] = {
      ...section,
      lessons: updatedLessons
    };
    
    setSections(updatedSections);
  };

  const totalLessons = sections.reduce((total, section) => total + section.lessons.length, 0);
  const publishedLessons = sections.reduce((total, section) => 
    total + section.lessons.filter(lesson => lesson.isPublished).length, 0
  );
  const previewLessons = sections.reduce((total, section) => 
    total + section.lessons.filter(lesson => lesson.isPreview).length, 0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/teacher/courses')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Leçons</h1>
              <p className="text-gray-600">Cours: {course.title}</p>
            </div>
          </div>
          <button
            onClick={handleAddSection}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter une Section</span>
          </button>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des Sections et Leçons */}
          <div className="lg:col-span-2 space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* En-tête de Section */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                      {editingSectionId === section.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editingSectionTitle}
                            onChange={(e) => setEditingSectionTitle(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveSectionTitle}
                            className="text-primary-600 hover:text-primary-700"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingSectionId(null)}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditSectionTitle(section.id, section.title)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Modifier le titre"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAddLesson(section.id)}
                        className="p-2 text-primary-600 hover:text-primary-700 transition-colors"
                        title="Ajouter une leçon"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors"
                        title="Supprimer la section"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Leçons */}
                <div className="divide-y divide-gray-200">
                  {section.lessons.map((lesson) => (
                    <div key={lesson.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                              <div className="flex items-center space-x-2">
                                {lesson.isPublished ? (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800">
                                    Publié
                                  </span>
                                ) : (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                    Brouillon
                                  </span>
                                )}
                                {lesson.isPreview && (
                                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    Prévisualisation
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Video className="h-4 w-4" />
                                <span>{lesson.videoUrl ? 'Vidéo téléchargée' : 'Pas de vidéo'}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="h-4 w-4" />
                                <span>{lesson.resources.length} ressources</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleLessonPreview(lesson.id, section.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              lesson.isPreview 
                                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                            title={lesson.isPreview ? 'Retirer de la prévisualisation' : 'Définir comme prévisualisation'}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => toggleLessonPublished(lesson.id, section.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              lesson.isPublished 
                                ? 'text-success-600 bg-success-50 hover:bg-success-100' 
                                : 'text-gray-400 hover:text-success-600 hover:bg-success-50'
                            }`}
                            title={lesson.isPublished ? 'Dépublier' : 'Publier'}
                          >
                            {lesson.isPublished ? <CheckCircle className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </button>
                          
                          <button
                            onClick={() => handleEditLesson(lesson, section.id)}
                            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Modifier la leçon"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteLesson(lesson.id, section.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer la leçon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {section.lessons.length === 0 && (
                    <div className="px-6 py-8 text-center">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 mb-3">Aucune leçon dans cette section</p>
                      <button
                        onClick={() => handleAddLesson(section.id)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Ajouter votre première leçon
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sections.length === 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune section</h3>
                <p className="text-gray-600 mb-6">Commencez à structurer votre cours en ajoutant des sections</p>
                <button
                  onClick={handleAddSection}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Ajouter une Section
                </button>
              </div>
            )}
          </div>

          {/* Éditeur de Leçon ou Statistiques */}
          <div className="space-y-6">
            {showLessonEditor && editingLesson ? (
              <LessonEditor
                lesson={editingLesson}
                onSave={handleSaveLesson}
                onCancel={() => {
                  setShowLessonEditor(false);
                  setEditingLesson(null);
                }}
              />
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques du Cours</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total des Leçons</span>
                      <span className="font-medium">{totalLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Leçons Publiées</span>
                      <span className="font-medium">{publishedLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Leçons en Prévisualisation</span>
                      <span className="font-medium">{previewLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sections</span>
                      <span className="font-medium">{sections.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleAddSection}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <Plus className="h-5 w-5 text-primary-600" />
                      <span className="font-medium text-gray-900">Ajouter une Section</span>
                    </button>
                    <button
                      onClick={() => navigate(`/course/${course.id}`)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <Eye className="h-5 w-5 text-secondary-600" />
                      <span className="font-medium text-gray-900">Prévisualiser le Cours</span>
                    </button>
                    <button
                      onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <Edit className="h-5 w-5 text-success-600" />
                      <span className="font-medium text-gray-900">Modifier les Détails du Cours</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirmer la suppression</h3>
              <p className="text-gray-700 mb-6">
                {showDeleteConfirm.type === 'section' 
                  ? 'Êtes-vous sûr de vouloir supprimer cette section ? Toutes les leçons qu\'elle contient seront également supprimées.' 
                  : 'Êtes-vous sûr de vouloir supprimer cette leçon ? Cette action est irréversible.'}
              </p>
              <div className="flex items-center space-x-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
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

export default TeacherLessonManager;