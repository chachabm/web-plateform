import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  BookOpen,
  Users,
  Video,
  Award,
  TrendingUp,
  DollarSign,
  MoreVertical,
  Upload,
  Download
} from 'lucide-react';
import { mockCourses } from '../data/mockData';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const stats = {
    totalCourses: 156,
    totalStudents: 12450,
    totalInstructors: 89,
    totalRevenue: 245600,
    monthlyGrowth: 12.5
  };

  const filteredCourses = mockCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock certificates data
  const certificates = [
    {
      id: '1',
      studentName: 'Jean Dupont',
      studentEmail: 'jean@example.com',
      courseTitle: 'Espagnol Complet pour Débutants',
      issueDate: '2025-01-10T14:30:00Z',
      completionDate: '2025-01-08T11:20:00Z'
    },
    {
      id: '2',
      studentName: 'Sophie Martin',
      studentEmail: 'sophie@example.com',
      courseTitle: 'Maîtrise de la Conversation Française',
      issueDate: '2025-01-05T09:15:00Z',
      completionDate: '2025-01-03T16:45:00Z'
    },
    {
      id: '3',
      studentName: 'Michel Blanc',
      studentEmail: 'michel@example.com',
      courseTitle: 'Grammaire et Structure Allemandes',
      issueDate: '2024-12-20T10:30:00Z',
      completionDate: '2024-12-18T14:20:00Z'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage courses, lessons, and platform content</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/courses/new"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Course</span>
              </Link>
              <Link
                to="/admin/lessons/new"
                className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2"
              >
                <Video className="h-4 w-4" />
                <span>New Lesson</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents.toLocaleString()}</p>
              </div>
              <div className="bg-secondary-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Instructors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInstructors}</p>
              </div>
              <div className="bg-success-100 p-3 rounded-lg">
                <Award className="h-6 w-6 text-success-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth</p>
                <p className="text-2xl font-bold text-gray-900">+{stats.monthlyGrowth}%</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'courses', label: 'Courses' },
              { id: 'lessons', label: 'Lessons' },
              { id: 'users', label: 'Users' },
              { id: 'certificates', label: 'Certificates' },
              { id: 'analytics', label: 'Analytics' }
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link
                    to="/admin/courses/new"
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Course</h3>
                    <p className="text-gray-600 text-sm">Add a new course to your platform with detailed content and structure.</p>
                  </Link>
                  
                  <Link
                    to="/admin/lessons/new"
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-secondary-300 hover:shadow-md transition-all"
                  >
                    <div className="bg-secondary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Video className="h-6 w-6 text-secondary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Lesson</h3>
                    <p className="text-gray-600 text-sm">Create engaging video lessons with resources and interactive content.</p>
                  </Link>
                  
                  <Link
                    to="/admin/users"
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-success-300 hover:shadow-md transition-all"
                  >
                    <div className="bg-success-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-success-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Users</h3>
                    <p className="text-gray-600 text-sm">View and manage student and instructor accounts on your platform.</p>
                  </Link>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Platform Health</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-6 text-white">
                    <h3 className="font-semibold mb-4">System Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-primary-100">Server Status</span>
                        <span className="font-medium">Healthy</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-100">Active Users</span>
                        <span className="font-medium">2,847</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-100">Storage Used</span>
                        <span className="font-medium">67%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-100">Last Backup</span>
                        <span className="font-medium">Today, 04:30 AM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Latest Updates</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">System Update Completed</p>
                          <p className="text-xs text-gray-500">Yesterday, 10:30 PM</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Upload className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">New Features Deployed</p>
                          <p className="text-xs text-gray-500">Jan 15, 2025</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-yellow-100 p-2 rounded-full">
                          <TrendingUp className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Traffic Increase Detected</p>
                          <p className="text-xs text-gray-500">Jan 12, 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Course Management</h2>
                <Link
                  to="/admin/courses/new"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Course</span>
                </Link>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Courses Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{course.title}</div>
                              <div className="text-sm text-gray-500">{course.language} • {course.level}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.instructor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.students.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${(course.price * course.students).toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-success-100 text-success-800">
                            Published
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/admin/courses/${course.id}/lessons`}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Video className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/admin/courses/${course.id}/edit`}
                              className="text-secondary-600 hover:text-secondary-900"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <Link
                              to={`/course/${course.id}`}
                              className="text-success-600 hover:text-success-900"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Certificats Délivrés</h2>
                <button
                  onClick={() => alert('Exporting certificates data...')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Exporter</span>
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par étudiant ou cours..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    <span>Filtrer</span>
                  </button>
                </div>
              </div>

              {/* Certificates Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Étudiant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cours
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de Délivrance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date d'Achèvement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{cert.studentName}</div>
                              <div className="text-sm text-gray-500">{cert.studentEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cert.courseTitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(cert.issueDate).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(cert.completionDate).toLocaleDateString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/certificate/${cert.id}`)}
                              className="text-primary-600 hover:text-primary-900"
                              title="Voir le certificat"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => alert(`Téléchargement du certificat pour ${cert.studentName}...`)}
                              className="text-secondary-600 hover:text-secondary-900"
                              title="Télécharger le certificat"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <Link
                  to="/admin/users"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalStudents.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 mb-4">Total Students</div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+12% this month</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalInstructors}</div>
                  <div className="text-sm text-gray-600 mb-4">Total Instructors</div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+5% this month</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">15</div>
                  <div className="text-sm text-gray-600 mb-4">Total Admins</div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>No change</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Lesson Management</h2>
                <Link
                  to="/admin/lessons/new"
                  className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Lesson</span>
                </Link>
              </div>
              
              <div className="text-center py-12">
                <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                <p className="text-gray-600 mb-6">Choose a course from the courses tab to manage its lessons</p>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View Courses
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;