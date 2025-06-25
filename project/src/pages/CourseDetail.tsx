import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Award, 
  Download, 
  Share2, 
  Heart,
  CheckCircle,
  Lock,
  BookOpen,
  MessageCircle,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';
import { mockCourses } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: 'Course Assistant',
      message: 'Welcome! How can I help you with this course?',
      timestamp: new Date().toISOString(),
      isBot: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  const course = mockCourses.find(c => c.id === id);
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const curriculum = [
    {
      id: 1,
      title: 'Getting Started',
      lessons: [
        { id: 1, title: 'Welcome to the Course', duration: '5:30', isPreview: true },
        { id: 2, title: 'Course Overview', duration: '8:15', isPreview: true },
        { id: 3, title: 'Setting Up Your Environment', duration: '12:45', isPreview: false },
      ]
    },
    {
      id: 2,
      title: 'Fundamentals',
      lessons: [
        { id: 4, title: 'Basic Concepts', duration: '15:20', isPreview: false },
        { id: 5, title: 'Practice Exercise 1', duration: '10:30', isPreview: false },
        { id: 6, title: 'Common Mistakes to Avoid', duration: '7:45', isPreview: false },
      ]
    },
    {
      id: 3,
      title: 'Advanced Topics',
      lessons: [
        { id: 7, title: 'Advanced Techniques', duration: '18:30', isPreview: false },
        { id: 8, title: 'Real-world Applications', duration: '22:15', isPreview: false },
        { id: 9, title: 'Final Project', duration: '25:00', isPreview: false },
      ]
    }
  ];

  const reviews = [
    {
      id: 1,
      user: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent course! The instructor explains everything clearly and the exercises are very practical.'
    },
    {
      id: 2,
      user: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      rating: 4,
      date: '1 month ago',
      comment: 'Great content and well-structured. Would recommend to anyone starting their journey.'
    }
  ];

  const handleEnroll = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/course/${course.id}` } } });
      return;
    }
    
    setIsEnrolled(true);
    alert(`🎉 Successfully enrolled in "${course.title}"!\n\nYou now have full access to all course materials. Check your email for enrollment confirmation.`);
  };

  const handleWishlist = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      alert(`❤️ "${course.title}" has been added to your wishlist!`);
    } else {
      alert(`💔 "${course.title}" has been removed from your wishlist.`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: `Check out this amazing ${course.language} course: ${course.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('📋 Course link copied to clipboard!');
      });
    }
  };

  const handlePreviewLesson = (lessonId: number) => {
    alert(`🎬 Playing preview for lesson ${lessonId}...\n\nThis would open a video player with the lesson preview.`);
  };

  const handleDownloadResources = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Create a mock download
    const resources = [
      'Course Syllabus.pdf',
      'Vocabulary List.pdf',
      'Grammar Guide.pdf',
      'Practice Exercises.pdf',
      'Audio Files.zip'
    ];
    
    // Simulate download process
    const downloadResource = (resourceName: string, index: number) => {
      setTimeout(() => {
        // Create a temporary download link
        const link = document.createElement('a');
        link.href = '#';
        link.download = resourceName;
        
        // Show download notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        notification.textContent = `📥 Downloaded: ${resourceName}`;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
        
        console.log(`Downloaded: ${resourceName}`);
      }, index * 500);
    };
    
    // Download all resources with staggered timing
    resources.forEach((resource, index) => {
      downloadResource(resource, index);
    });
    
    alert(`📥 Starting download of ${resources.length} course resources...\n\nFiles will be downloaded to your default download folder.`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      id: chatMessages.length + 1,
      user: user?.name || 'Student',
      message: newMessage,
      timestamp: new Date().toISOString(),
      isBot: false
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Thanks for your question! I'll help you with that.",
        "That's a great question about this course topic.",
        "Let me provide you with some helpful information.",
        "I understand your concern. Here's what I recommend:",
        "That's an excellent point! Many students ask about this."
      ];
      
      const botMessage = {
        id: chatMessages.length + 2,
        user: 'Course Assistant',
        message: botResponses[Math.floor(Math.random() * botResponses.length)],
        timestamp: new Date().toISOString(),
        isBot: true
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
                </span>
                <span className="text-gray-300">{course.language}</span>
                {course.isBestseller && (
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Bestseller
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-gray-300">({course.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={course.instructorAvatar}
                  alt={course.instructor}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">Created by {course.instructor}</p>
                  <p className="text-gray-400 text-sm">Language Expert & Educator</p>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-8">
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button 
                      onClick={() => handlePreviewLesson(1)}
                      className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all"
                    >
                      <Play className="h-8 w-8 text-white" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-green-600">FREE</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={handleWishlist}
                        className={`p-2 rounded-full transition-colors ${
                          isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={handleShare}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {user ? (
                    isEnrolled ? (
                      <Link
                        to={`/course/${course.id}/learn`}
                        className="w-full bg-success-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-success-700 transition-colors text-center block mb-4"
                      >
                        Continue Learning
                      </Link>
                    ) : (
                      <button
                        onClick={handleEnroll}
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors mb-4 flex items-center justify-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Start Learning</span>
                      </button>
                    )
                  ) : (
                    <Link
                      to="/login"
                      state={{ from: { pathname: `/course/${course.id}` } }}
                      className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors text-center block mb-4"
                    >
                      Sign Up to Start Learning
                    </Link>
                  )}

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <Monitor className="h-4 w-4 text-gray-400" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-gray-400" />
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Download className="h-4 w-4 text-gray-400" />
                      <button 
                        onClick={handleDownloadResources}
                        className="text-left hover:text-primary-600 transition-colors"
                      >
                        Downloadable resources
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Award className="h-4 w-4 text-gray-400" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                      <button 
                        onClick={() => setShowChat(true)}
                        className="text-left hover:text-primary-600 transition-colors"
                      >
                        Chat with instructor
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'curriculum', label: 'Curriculum' },
                  { id: 'instructor', label: 'Instructor' },
                  { id: 'reviews', label: 'Reviews' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
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
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      'Master the fundamentals of the language',
                      'Build confidence in speaking and listening',
                      'Learn practical vocabulary for daily situations',
                      'Understand grammar rules and sentence structure',
                      'Practice with real-world scenarios',
                      'Develop pronunciation skills'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-success-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Description</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p className="mb-4">
                      This comprehensive course is designed for beginners who want to master the language from the ground up. 
                      You'll learn through a combination of video lessons, interactive exercises, and practical applications.
                    </p>
                    <p className="mb-4">
                      Our structured approach ensures that you build a solid foundation while developing practical skills 
                      that you can use in real-world situations. Each lesson builds upon the previous one, creating a 
                      seamless learning experience.
                    </p>
                    <p>
                      By the end of this course, you'll have the confidence and skills to communicate effectively 
                      and continue your language learning journey independently.
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2 text-gray-700">
                    <li>• No prior experience required</li>
                    <li>• Access to a computer or mobile device</li>
                    <li>• Willingness to practice regularly</li>
                    <li>• Basic understanding of English</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                  <div className="text-sm text-gray-500">
                    {curriculum.reduce((total, section) => total + section.lessons.length, 0)} lessons • {course.duration}
                  </div>
                </div>

                {curriculum.map((section) => (
                  <div key={section.id} className="border border-gray-200 rounded-lg">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {section.lessons.length} lessons
                      </p>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {section.lessons.map((lesson) => (
                        <div key={lesson.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center space-x-3">
                            {lesson.isPreview || isEnrolled ? (
                              <button
                                onClick={() => handlePreviewLesson(lesson.id)}
                                className="text-primary-600 hover:text-primary-700"
                              >
                                <Play className="h-4 w-4" />
                              </button>
                            ) : (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                            <span className={`${lesson.isPreview || isEnrolled ? 'text-gray-900' : 'text-gray-500'}`}>
                              {lesson.title}
                            </span>
                            {lesson.isPreview && (
                              <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs font-medium">
                                Preview
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="space-y-6">
                <div className="flex items-start space-x-6">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.instructor}</h2>
                    <p className="text-gray-600 mb-4">Language Expert & Educator</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">4.8</div>
                        <div className="text-sm text-gray-500">Instructor Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">2,547</div>
                        <div className="text-sm text-gray-500">Reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">15,420</div>
                        <div className="text-sm text-gray-500">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">12</div>
                        <div className="text-sm text-gray-500">Courses</div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert('Following instructor...')}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Follow Instructor
                    </button>
                  </div>
                </div>
                
                <div className="prose max-w-none text-gray-700">
                  <p>
                    {course.instructor} is a passionate language educator with over 10 years of experience 
                    teaching languages to students worldwide. With a Master's degree in Linguistics and 
                    certifications in language instruction, they bring both academic expertise and practical 
                    teaching skills to every course.
                  </p>
                  <p>
                    Their teaching philosophy focuses on making language learning enjoyable and practical, 
                    helping students build confidence through real-world applications and interactive exercises.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{course.rating}</span>
                    <span className="text-gray-500">({course.reviewCount} reviews)</span>
                  </div>
                </div>

                {user && isEnrolled && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              className="text-yellow-400 hover:text-yellow-500"
                            >
                              <Star className="h-6 w-6 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                        <textarea
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Share your experience with this course..."
                        />
                      </div>
                      <button
                        onClick={() => alert('Review submitted! Thank you for your feedback.')}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Submit Review
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.avatar}
                          alt={review.user}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{review.user}</h4>
                            <div className="flex items-center space-x-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                          <div className="flex items-center space-x-4 mt-3">
                            <button className="text-sm text-gray-500 hover:text-gray-700">
                              👍 Helpful (12)
                            </button>
                            <button className="text-sm text-gray-500 hover:text-gray-700">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => alert('Loading more reviews...')}
                  className="w-full py-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Course Features */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">This course includes:</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{course.duration} on-demand video</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-gray-400" />
                    <button 
                      onClick={handleDownloadResources}
                      className="text-gray-700 hover:text-primary-600 transition-colors text-left"
                    >
                      Downloadable resources
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">Access on mobile and desktop</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">Certificate of completion</span>
                  </div>
                </div>
              </div>

              {/* Related Courses */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Courses</h3>
                <div className="space-y-4">
                  {mockCourses.slice(0, 3).filter(c => c.id !== course.id).map((relatedCourse) => (
                    <Link
                      key={relatedCourse.id}
                      to={`/course/${relatedCourse.id}`}
                      className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <img
                        src={relatedCourse.thumbnail}
                        alt={relatedCourse.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {relatedCourse.title}
                        </h4>
                        <p className="text-sm text-gray-500">{relatedCourse.instructor}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500">{relatedCourse.rating}</span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-green-600 font-medium">FREE</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Course Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.isBot
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-primary-600 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-primary-100'
                    }`}>
                      {message.user} • {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;