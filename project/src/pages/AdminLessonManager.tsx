import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Play, 
  Save,
  Eye,
  EyeOff,
  GripVertical,
  Video,
  FileText,
  Clock
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  videoFile?: File;
  resources: Resource[];
  order: number;
  isPublished: boolean;
  isPreview: boolean;
}

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video' | 'audio' | 'other';
  url: string;
  size: string;
}

const AdminLessonManager: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Welcome to Spanish Basics',
      description: 'Introduction to the Spanish language and course overview',
      duration: '5:30',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      resources: [
        { id: '1', name: 'Course Syllabus.pdf', type: 'pdf', url: '#', size: '2.5 MB' },
        { id: '2', name: 'Vocabulary List.doc', type: 'doc', url: '#', size: '1.2 MB' }
      ],
      order: 1,
      isPublished: true,
      isPreview: true
    },
    {
      id: '2',
      title: 'Spanish Alphabet and Pronunciation',
      description: 'Learn the Spanish alphabet and basic pronunciation rules',
      duration: '12:45',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      resources: [
        { id: '3', name: 'Pronunciation Guide.pdf', type: 'pdf', url: '#', size: '3.1 MB' }
      ],
      order: 2,
      isPublished: true,
      isPreview: false
    },
    {
      id: '3',
      title: 'Basic Greetings and Introductions',
      description: 'Common Spanish greetings and how to introduce yourself',
      duration: '8:20',
      videoUrl: '',
      resources: [],
      order: 3,
      isPublished: false,
      isPreview: false
    }
  ]);

  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [draggedLesson, setDraggedLesson] = useState<string | null>(null);

  const createNewLesson = () => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: 'New Lesson',
      description: '',
      duration: '0:00',
      videoUrl: '',
      resources: [],
      order: lessons.length + 1,
      isPublished: false,
      isPreview: false
    };
    setEditingLesson(newLesson);
    setShowLessonForm(true);
  };

  const saveLesson = (lesson: Lesson) => {
    if (lessons.find(l => l.id === lesson.id)) {
      setLessons(lessons.map(l => l.id === lesson.id ? lesson : l));
    } else {
      setLessons([...lessons, lesson]);
    }
    setEditingLesson(null);
    setShowLessonForm(false);
  };

  const deleteLesson = (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      setLessons(lessons.filter(l => l.id !== lessonId));
    }
  };

  const togglePublished = (lessonId: string) => {
    setLessons(lessons.map(lesson =>
      lesson.id === lessonId ? { ...lesson, isPublished: !lesson.isPublished } : lesson
    ));
  };

  const togglePreview = (lessonId: string) => {
    setLessons(lessons.map(lesson =>
      lesson.id === lessonId ? { ...lesson, isPreview: !lesson.isPreview } : lesson
    ));
  };

  const handleDragStart = (lessonId: string) => {
    setDraggedLesson(lessonId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetLessonId: string) => {
    e.preventDefault();
    if (!draggedLesson || draggedLesson === targetLessonId) return;

    const draggedIndex = lessons.findIndex(l => l.id === draggedLesson);
    const targetIndex = lessons.findIndex(l => l.id === targetLessonId);

    const newLessons = [...lessons];
    const [draggedItem] = newLessons.splice(draggedIndex, 1);
    newLessons.splice(targetIndex, 0, draggedItem);

    // Update order
    newLessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });

    setLessons(newLessons);
    setDraggedLesson(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lesson Manager</h1>
                <p className="text-gray-600">Course: Spanish Basics</p>
              </div>
            </div>
            <button
              onClick={createNewLesson}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Lesson</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Course Lessons ({lessons.length})
                </h2>
                <div className="text-sm text-gray-500">
                  {lessons.filter(l => l.isPublished).length} published
                </div>
              </div>

              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    draggable
                    onDragStart={() => handleDragStart(lesson.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, lesson.id)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors cursor-move"
                  >
                    <div className="flex items-center space-x-4">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          <div className="flex items-center space-x-2">
                            {lesson.isPublished ? (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800">
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                Draft
                              </span>
                            )}
                            {lesson.isPreview && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                Preview
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
                            <span>{lesson.videoUrl ? 'Video uploaded' : 'No video'}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FileText className="h-4 w-4" />
                            <span>{lesson.resources.length} resources</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => togglePreview(lesson.id)}
                          className={`p-2 rounded-lg ${
                            lesson.isPreview 
                              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                              : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                          title={lesson.isPreview ? 'Remove from preview' : 'Make preview'}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => togglePublished(lesson.id)}
                          className={`p-2 rounded-lg ${
                            lesson.isPublished 
                              ? 'text-success-600 bg-success-50 hover:bg-success-100' 
                              : 'text-gray-400 hover:text-success-600 hover:bg-success-50'
                          }`}
                          title={lesson.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {lesson.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        
                        <button
                          onClick={() => {
                            setEditingLesson(lesson);
                            setShowLessonForm(true);
                          }}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => deleteLesson(lesson.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {lessons.length === 0 && (
                  <div className="text-center py-12">
                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons yet</h3>
                    <p className="text-gray-600 mb-6">Start building your course by adding your first lesson</p>
                    <button
                      onClick={createNewLesson}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                      Create First Lesson
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lesson Form */}
          <div className="space-y-6">
            {showLessonForm && editingLesson && (
              <LessonForm
                lesson={editingLesson}
                onSave={saveLesson}
                onCancel={() => {
                  setEditingLesson(null);
                  setShowLessonForm(false);
                }}
              />
            )}

            {!showLessonForm && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Lessons</span>
                    <span className="font-medium">{lessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Published</span>
                    <span className="font-medium">{lessons.filter(l => l.isPublished).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preview Lessons</span>
                    <span className="font-medium">{lessons.filter(l => l.isPreview).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Duration</span>
                    <span className="font-medium">
                      {lessons.reduce((total, lesson) => {
                        const [minutes, seconds] = lesson.duration.split(':').map(Number);
                        return total + minutes + (seconds / 60);
                      }, 0).toFixed(0)} min
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Lesson Form Component
interface LessonFormProps {
  lesson: Lesson;
  onSave: (lesson: Lesson) => void;
  onCancel: () => void;
}

const LessonForm: React.FC<LessonFormProps> = ({ lesson, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Lesson>(lesson);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // In a real app, you would upload the file and get a URL
      setFormData({ ...formData, videoUrl: URL.createObjectURL(file) });
    }
  };

  const addResource = () => {
    const newResource: Resource = {
      id: Date.now().toString(),
      name: 'New Resource',
      type: 'pdf',
      url: '',
      size: '0 MB'
    };
    setFormData({
      ...formData,
      resources: [...formData.resources, newResource]
    });
  };

  const updateResource = (resourceId: string, updates: Partial<Resource>) => {
    setFormData({
      ...formData,
      resources: formData.resources.map(resource =>
        resource.id === resourceId ? { ...resource, ...updates } : resource
      )
    });
  };

  const removeResource = (resourceId: string) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter(resource => resource.id !== resourceId)
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {lesson.id ? 'Edit Lesson' : 'Create New Lesson'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lesson Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 10:30"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video
          </label>
          <div className="space-y-3">
            {formData.videoUrl && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Video className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Video uploaded</span>
                </div>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Video</span>
              </label>
              <span className="text-sm text-gray-500">or</span>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="Video URL"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Resources
            </label>
            <button
              type="button"
              onClick={addResource}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Add Resource
            </button>
          </div>
          <div className="space-y-2">
            {formData.resources.map((resource) => (
              <div key={resource.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={resource.name}
                  onChange={(e) => updateResource(resource.id, { name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Resource name"
                />
                <select
                  value={resource.type}
                  onChange={(e) => updateResource(resource.id, { type: e.target.value as Resource['type'] })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="pdf">PDF</option>
                  <option value="doc">Document</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="other">Other</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeResource(resource.id)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Published</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.isPreview}
              onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">Preview Lesson</span>
          </label>
        </div>

        <div className="flex items-center space-x-3 pt-4">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
          >
            <Save className="h-4 w-4" />
            <span>Save Lesson</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLessonManager;