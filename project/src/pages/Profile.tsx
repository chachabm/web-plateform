import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Camera, 
  GraduationCap, 
  Users, 
  Settings,
  BookOpen,
  Award,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Passionate language learner exploring new cultures through communication.',
    languages: ['English', 'Spanish'],
    location: 'New York, USA',
    website: 'https://example.com'
  });

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', formData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: 'Passionate language learner exploring new cultures through communication.',
      languages: ['English', 'Spanish'],
      location: 'New York, USA',
      website: 'https://example.com'
    });
    setIsEditing(false);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'instructor':
        return <Users className="h-6 w-6" />;
      case 'admin':
        return <Settings className="h-6 w-6" />;
      default:
        return <GraduationCap className="h-6 w-6" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'from-secondary-600 to-purple-600';
      case 'admin':
        return 'from-red-600 to-pink-600';
      default:
        return 'from-primary-600 to-blue-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'instructor':
        return 'Teacher';
      case 'admin':
        return 'Administrator';
      default:
        return 'Student';
    }
  };

  const stats = {
    coursesCompleted: user?.role === 'instructor' ? 12 : 8,
    totalHours: user?.role === 'instructor' ? 240 : 156,
    students: user?.role === 'instructor' ? 1250 : 0,
    certificates: user?.role === 'instructor' ? 5 : 3,
    rating: user?.role === 'instructor' ? 4.8 : 0,
    streak: user?.role === 'instructor' ? 0 : 15
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className={`bg-gradient-to-r ${getRoleColor(user.role)} rounded-xl p-8 text-white mb-8`}>
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
              />
              <button className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-2">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                  {getRoleIcon(user.role)}
                  <span>{getRoleLabel(user.role)}</span>
                </span>
              </div>
              <p className="text-white/80 mb-2">{user.email}</p>
              <p className="text-white/70 text-sm">
                Member since {new Date(user.joinedDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">{formData.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{formData.email}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Bio</p>
                    <p className="text-gray-900">{formData.bio}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Location</p>
                      <p className="font-medium text-gray-900">{formData.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Website</p>
                      <a 
                        href={formData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-primary-600 hover:text-primary-700"
                      >
                        {formData.website}
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.languages.map((language, index) => (
                        <span
                          key={index}
                          className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive updates about your courses and progress</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified about new lessons and achievements</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                    <p className="text-sm text-gray-500">Make your profile visible to other learners</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to sign out?')) {
                        logout();
                        navigate('/');
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {user.role === 'instructor' ? 'Teaching Stats' : 'Learning Stats'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {user.role === 'instructor' ? 'Courses Created' : 'Courses Completed'}
                  </span>
                  <span className="font-semibold">{stats.coursesCompleted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {user.role === 'instructor' ? 'Teaching Hours' : 'Learning Hours'}
                  </span>
                  <span className="font-semibold">{stats.totalHours}</span>
                </div>
                {user.role === 'instructor' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Students</span>
                      <span className="font-semibold">{stats.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-semibold">{stats.rating}/5</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Streak</span>
                      <span className="font-semibold">{stats.streak} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Certificates</span>
                      <span className="font-semibold">{stats.certificates}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {user.role === 'instructor' ? (
                  <>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                      <span className="font-medium text-gray-900">Create New Course</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <Users className="h-5 w-5 text-secondary-600" />
                      <span className="font-medium text-gray-900">Schedule Session</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                      <span className="font-medium text-gray-900">Browse Courses</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                      <Award className="h-5 w-5 text-success-600" />
                      <span className="font-medium text-gray-900">View Certificates</span>
                    </button>
                  </>
                )}
                <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Account Settings</span>
                </button>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className={`bg-gradient-to-r ${getRoleColor(user.role)} rounded-xl p-6 text-white text-center`}>
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {user.role === 'instructor' ? (
                  <Users className="h-8 w-8" />
                ) : (
                  <Award className="h-8 w-8" />
                )}
              </div>
              <h3 className="font-semibold mb-2">
                {user.role === 'instructor' ? 'Expert Teacher' : 'Dedicated Learner'}
              </h3>
              <p className="text-white/80 text-sm">
                {user.role === 'instructor' 
                  ? 'Inspiring students worldwide' 
                  : 'Making great progress!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;