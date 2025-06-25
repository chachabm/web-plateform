import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Plus, Trash2, Edit, Eye, GripVertical } from 'lucide-react';
import { mockCourses } from '../data/mockData';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
  order: number;
  isPublished: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

const AdminCourseEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const course = mockCourses.find(c => c.id === id);
  
  const [courseData, setCourseData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price || 0,
    level: course?.level || 'Beginner',
    language: course?.language || '',
    category: course?.category || '',
    thumbnail: course?.thumbnail || ''
  });

  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Getting Started',
      order: 1,
      lessons: [
        {
          id: '1',
          title: 'Welcome to the Course',
          duration: '5:30',
          videoUrl: '',
          description: 'Introduction to the course and what you will learn',
          order: 1,
          isPublished: true
        },
        {
          id: '2',
          title: 'Course Overview',
          duration: '8:15',
          videoUrl: '',
          description: 'Overview of the course structure and learning path',
          order: 2,
          isPublished: true
        }
      ]
    },
    {
      id: '2',
      title: 'Fundamentals',
      order: 2,
      lessons: [
        {
          id: '3',
          title: 'Basic Concepts',
          duration: '15:20',
          videoUrl: '',
          description: 'Learn the fundamental concepts',
          order: 1,
          isPublished: false
        }
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState('course');
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <button
            onClick={() => navigate('/admin')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleCourseUpdate = (field: string, value: any) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: 'New Section',
      lessons: [],
      order: sections.length + 1
    };
    setSections([...sections, newSection]);
    setEditingSection(newSection);
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const addLesson = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: 'New Lesson',
      duration: '0:00',
      videoUrl: '',
      description: '',
      order: section.lessons.length + 1,
      isPublished: false
    };

    updateSection(sectionId, {
      lessons: [...section.lessons, newLesson]
    });
    setEditingLesson(newLesson);
  };

  const updateLesson = (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const updatedLessons = section.lessons.map(lesson =>
      lesson.id === lessonId ? { ...lesson, ...updates } : lesson
    );

    updateSection(sectionId, { lessons: updatedLessons });
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const updatedLessons = section.lessons.filter(lesson => lesson.id !== lessonId);
    updateSection(sectionId, { lessons: updatedLessons });
  };

  const saveCourse = () => {
    // Here you would save to your backend
    console.log('Saving course:', { courseData, sections });
    alert('Course saved successfully!');
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
                <h1 className="text-xl font-bold text-gray-900">Edit Course</h1>
                <p className="text-gray-600">{course.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(`/course/${course.id}`)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={saveCourse}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'course', label: 'Course Details' },
              { id: 'curriculum', label: 'Curriculum' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Course Details Tab */}
        {activeTab === 'course' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={courseData.title}
                      onChange={(e) => handleCourseUpdate('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={courseData.description}
                      onChange={(e) => handleCourseUpdate('description', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={courseData.price}
                        onChange={(e) => handleCourseUpdate('price', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Level
                      </label>
                      <select
                        value={courseData.level}
                        onChange={(e) => handleCourseUpdate('level', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <input
                        type="text"
                        value={courseData.language}
                        onChange={(e) => handleCourseUpdate('language', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        value={courseData.category}
                        onChange={(e) => handleCourseUpdate('category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Thumbnail</h3>
                <div className="space-y-4">
                  <img
                    src={courseData.thumbnail}
                    alt="Course thumbnail"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    <span>Upload New Image</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students</span>
                    <span className="font-medium">{course.students.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating</span>
                    <span className="font-medium">{course.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reviews</span>
                    <span className="font-medium">{course.reviewCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
              <button
                onClick={addSection}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-4">
              {sections.map((section, sectionIndex) => (
                <div key={section.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <GripVertical className="h-5 w-5 text-gray-400" />
                        {editingSection?.id === section.id ? (
                          <input
                            type="text"
                            value={editingSection.title}
                            onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                            onBlur={() => {
                              updateSection(section.id, { title: editingSection.title });
                              setEditingSection(null);
                            }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                updateSection(section.id, { title: editingSection.title });
                                setEditingSection(null);
                              }
                            }}
                            className="text-lg font-semibold bg-transparent border-none focus:outline-none"
                            autoFocus
                          />
                        ) : (
                          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingSection(section)}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => addLesson(section.id)}
                          className="p-2 text-primary-600 hover:text-primary-700"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="divide-y divide-gray-200">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <div className="flex-1">
                              {editingLesson?.id === lesson.id ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={editingLesson.title}
                                    onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Lesson title"
                                  />
                                  <textarea
                                    value={editingLesson.description}
                                    onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="Lesson description"
                                    rows={2}
                                  />
                                  <div className="grid grid-cols-2 gap-3">
                                    <input
                                      type="text"
                                      value={editingLesson.duration}
                                      onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                      placeholder="Duration (e.g., 10:30)"
                                    />
                                    <input
                                      type="url"
                                      value={editingLesson.videoUrl}
                                      onChange={(e) => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })}
                                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                      placeholder="Video URL"
                                    />
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={() => {
                                        updateLesson(section.id, lesson.id, editingLesson);
                                        setEditingLesson(null);
                                      }}
                                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingLesson(null)}
                                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                  <p className="text-sm text-gray-600">{lesson.description}</p>
                                  <div className="flex items-center space-x-4 mt-2">
                                    <span className="text-xs text-gray-500">{lesson.duration}</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      lesson.isPublished 
                                        ? 'bg-success-100 text-success-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {lesson.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingLesson(lesson)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteLesson(section.id, lesson.id)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {section.lessons.length === 0 && (
                      <div className="px-6 py-8 text-center">
                        <p className="text-gray-500">No lessons in this section</p>
                        <button
                          onClick={() => addLesson(section.id)}
                          className="mt-2 text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Add your first lesson
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Course Status</h3>
                  <p className="text-sm text-gray-600">Control whether this course is visible to students</p>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Enrollment</h3>
                  <p className="text-sm text-gray-600">Allow new student enrollments</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Certificate</h3>
                  <p className="text-sm text-gray-600">Issue certificates upon completion</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourseEdit;