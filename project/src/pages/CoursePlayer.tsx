import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward,
  Settings,
  Download,
  BookOpen,
  CheckCircle,
  Lock,
  MessageCircle,
  FileText,
  Award,
  ArrowLeft
} from 'lucide-react';
import { mockCourses } from '../data/mockData';

const CoursePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentLessonId, setCurrentLessonId] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: 'Course Assistant',
      message: 'Welcome to this lesson! How can I help you?',
      timestamp: new Date().toISOString(),
      isBot: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
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
        { id: 1, title: 'Welcome to the Course', duration: '5:30', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
        { id: 2, title: 'Course Overview', duration: '8:15', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4' },
        { id: 3, title: 'Setting Up Your Environment', duration: '12:45', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4' },
      ]
    },
    {
      id: 2,
      title: 'Fundamentals',
      lessons: [
        { id: 4, title: 'Basic Concepts', duration: '15:20', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
        { id: 5, title: 'Practice Exercise 1', duration: '10:30', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4' },
        { id: 6, title: 'Common Mistakes to Avoid', duration: '7:45', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4' },
      ]
    },
    {
      id: 3,
      title: 'Advanced Topics',
      lessons: [
        { id: 7, title: 'Advanced Techniques', duration: '18:30', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
        { id: 8, title: 'Real-world Applications', duration: '22:15', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4' },
        { id: 9, title: 'Final Project', duration: '25:00', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4' },
      ]
    }
  ];

  const allLessons = curriculum.flatMap(section => section.lessons);
  const currentLesson = allLessons.find(lesson => lesson.id === currentLessonId);
  const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      setCurrentLessonId(nextLesson.id);
      setCurrentTime(0);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      setCurrentLessonId(prevLesson.id);
      setCurrentTime(0);
    }
  };

  const markLessonComplete = () => {
    if (!completedLessons.includes(currentLessonId)) {
      setCompletedLessons([...completedLessons, currentLessonId]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (completedLessons.length / allLessons.length) * 100;

  const handleDownloadLesson = () => {
    // Create a mock download notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = `📥 Downloading: ${currentLesson?.title}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
    
    alert(`📥 Starting download of "${currentLesson?.title}"\n\nThe video will be saved to your downloads folder for offline viewing.`);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: chatMessages.length + 1,
      user: 'Student',
      message: newMessage,
      timestamp: new Date().toISOString(),
      isBot: false
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Great question about this lesson! Let me help you with that.",
        "I see you're working on this topic. Here's some additional insight:",
        "That's a common question for this lesson. Here's the explanation:",
        "Thanks for asking! This is an important concept to understand.",
        "Let me clarify that point for you."
      ];
      
      const botMessage = {
        id: chatMessages.length + 2,
        user: 'Lesson Assistant',
        message: botResponses[Math.floor(Math.random() * botResponses.length)],
        timestamp: new Date().toISOString(),
        isBot: true
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to={`/course/${course.id}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-white font-semibold">{course.title}</h1>
                <p className="text-gray-400 text-sm">{currentLesson?.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                Progress: {Math.round(progressPercentage)}%
              </div>
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Video Player */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-black relative group">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={markLessonComplete}
              src={currentLesson?.videoUrl}
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={goToPreviousLesson}
                      disabled={currentLessonIndex === 0}
                      className="text-white hover:text-primary-400 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      <SkipBack className="h-6 w-6" />
                    </button>
                    
                    <button
                      onClick={togglePlay}
                      className="bg-primary-600 hover:bg-primary-700 text-white rounded-full p-3 transition-colors"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                    
                    <button
                      onClick={goToNextLesson}
                      disabled={currentLessonIndex === allLessons.length - 1}
                      className="text-white hover:text-primary-400 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                      <SkipForward className="h-6 w-6" />
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <button onClick={toggleMute} className="text-white hover:text-primary-400">
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={playbackRate}
                      onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
                      className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-600"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={0.75}>0.75x</option>
                      <option value={1}>1x</option>
                      <option value={1.25}>1.25x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>
                    
                    <button className="text-white hover:text-primary-400">
                      <Settings className="h-5 w-5" />
                    </button>
                    
                    <button className="text-white hover:text-primary-400">
                      <Maximize className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lesson Actions */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={markLessonComplete}
                  disabled={completedLessons.includes(currentLessonId)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    completedLessons.includes(currentLessonId)
                      ? 'bg-success-600 text-white cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    {completedLessons.includes(currentLessonId) ? 'Completed' : 'Mark Complete'}
                  </span>
                </button>
                
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Notes</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handleDownloadLesson}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Download lesson"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setShowChat(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Open chat"
                >
                  <MessageCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {showNotes && (
              <div className="mt-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Take notes about this lesson..."
                  className="w-full h-32 bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-gray-700">
            <div className="flex">
              {[
                { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'discussion', label: 'Q&A', icon: MessageCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-400 border-b-2 border-primary-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'curriculum' && (
              <div className="p-4 space-y-4">
                {curriculum.map((section) => (
                  <div key={section.id}>
                    <h3 className="text-white font-semibold mb-2">{section.title}</h3>
                    <div className="space-y-1">
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLessonId(lesson.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            lesson.id === currentLessonId
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {completedLessons.includes(lesson.id) ? (
                              <CheckCircle className="h-4 w-4 text-success-400" />
                            ) : lesson.id === currentLessonId ? (
                              <Play className="h-4 w-4" />
                            ) : (
                              <div className="w-4 h-4 border border-gray-500 rounded-full" />
                            )}
                            <div className="flex-1">
                              <div className="text-sm font-medium">{lesson.title}</div>
                              <div className="text-xs text-gray-400">{lesson.duration}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'overview' && (
              <div className="p-4 text-gray-300">
                <h3 className="text-white font-semibold mb-4">Lesson Overview</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-2">What you'll learn:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Key concepts and terminology</li>
                      <li>• Practical applications</li>
                      <li>• Common mistakes to avoid</li>
                      <li>• Best practices</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white mb-2">Resources:</h4>
                    <div className="space-y-2">
                      <button 
                        onClick={handleDownloadLesson}
                        className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 text-sm"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download lesson materials</span>
                      </button>
                      <button className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 text-sm">
                        <FileText className="h-4 w-4" />
                        <span>Lesson transcript</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'discussion' && (
              <div className="p-4">
                <div className="text-center text-gray-400 py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <p>No questions yet for this lesson.</p>
                  <p className="text-sm mt-2">Be the first to ask a question!</p>
                  <button
                    onClick={() => setShowChat(true)}
                    className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Start Discussion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Lesson Chat</h3>
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
                  placeholder="Ask about this lesson..."
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

export default CoursePlayer;