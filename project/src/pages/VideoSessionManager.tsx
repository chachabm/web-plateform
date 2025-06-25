import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  Users, 
  Video,
  Play,
  Settings,
  Copy,
  Eye,
  MessageCircle,
  Share2,
  Download,
  FileText
} from 'lucide-react';

interface VideoSession {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  maxParticipants: number;
  sessionType: 'live' | 'recorded' | 'hybrid';
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  meetingLink: string;
  recordingUrl?: string;
  participants: Participant[];
  materials: SessionMaterial[];
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'biweekly' | 'monthly';
}

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt?: string;
  leftAt?: string;
  status: 'registered' | 'joined' | 'left';
}

interface SessionMaterial {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video' | 'link';
  url: string;
  size?: string;
}

const VideoSessionManager: React.FC = () => {
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState<VideoSession[]>([
    {
      id: '1',
      title: 'Spanish Pronunciation Workshop',
      description: 'Interactive session focusing on Spanish pronunciation and accent training',
      courseId: '1',
      courseName: 'Complete Spanish for Beginners',
      scheduledDate: '2025-01-20',
      scheduledTime: '14:00',
      duration: 60,
      maxParticipants: 25,
      sessionType: 'live',
      status: 'scheduled',
      meetingLink: 'https://meet.learnme.com/spanish-pronunciation-123',
      participants: [
        {
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          status: 'registered'
        },
        {
          id: '2',
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          status: 'registered'
        }
      ],
      materials: [
        {
          id: '1',
          name: 'Pronunciation Guide.pdf',
          type: 'pdf',
          url: '#',
          size: '2.5 MB'
        }
      ],
      isRecurring: false
    },
    {
      id: '2',
      title: 'French Grammar Q&A',
      description: 'Weekly Q&A session for French grammar questions and practice',
      courseId: '2',
      courseName: 'French Conversation Mastery',
      scheduledDate: '2025-01-22',
      scheduledTime: '16:30',
      duration: 45,
      maxParticipants: 20,
      sessionType: 'live',
      status: 'completed',
      meetingLink: 'https://meet.learnme.com/french-grammar-456',
      recordingUrl: 'https://recordings.learnme.com/french-grammar-456.mp4',
      participants: [
        {
          id: '3',
          name: 'Michael Chen',
          email: 'michael@example.com',
          avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          status: 'joined',
          joinedAt: '2025-01-22T16:32:00Z',
          leftAt: '2025-01-22T17:15:00Z'
        }
      ],
      materials: [],
      isRecurring: true,
      recurringPattern: 'weekly'
    }
  ]);

  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState<VideoSession | null>(null);
  const [selectedSession, setSelectedSession] = useState<VideoSession | null>(null);

  const createNewSession = () => {
    const newSession: VideoSession = {
      id: Date.now().toString(),
      title: '',
      description: '',
      courseId: '',
      courseName: '',
      scheduledDate: '',
      scheduledTime: '',
      duration: 60,
      maxParticipants: 25,
      sessionType: 'live',
      status: 'scheduled',
      meetingLink: '',
      participants: [],
      materials: [],
      isRecurring: false
    };
    setEditingSession(newSession);
    setShowSessionForm(true);
  };

  const saveSession = (session: VideoSession) => {
    if (sessions.find(s => s.id === session.id)) {
      setSessions(sessions.map(s => s.id === session.id ? session : s));
      alert('✅ Session updated successfully!');
    } else {
      // Generate meeting link for new sessions
      session.meetingLink = `https://meet.learnme.com/${session.title.toLowerCase().replace(/\s+/g, '-')}-${session.id}`;
      setSessions([...sessions, session]);
      alert('🎉 Session created successfully!');
    }
    setEditingSession(null);
    setShowSessionForm(false);
  };

  const deleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      setSessions(sessions.filter(s => s.id !== sessionId));
      alert('🗑️ Session deleted successfully!');
    }
  };

  const startSession = (sessionId: string) => {
    setSessions(sessions.map(session =>
      session.id === sessionId ? { ...session, status: 'live' } : session
    ));
    alert('🎬 Session started! Opening video conference...\n\nThis would open your video conferencing platform.');
  };

  const joinSession = (sessionId: string) => {
    alert('🎥 Joining session...\n\nThis would open the video conference for you to join.');
  };

  const endSession = (sessionId: string) => {
    setSessions(sessions.map(session =>
      session.id === sessionId ? { ...session, status: 'completed' } : session
    ));
    alert('⏹️ Session ended successfully!');
  };

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('📋 Meeting link copied to clipboard!');
  };

  const shareSession = (session: VideoSession) => {
    const shareText = `Join my ${session.title} session on ${new Date(`${session.scheduledDate}T${session.scheduledTime}`).toLocaleDateString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: session.title,
        text: shareText,
        url: session.meetingLink
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${session.meetingLink}`);
      alert('📋 Session details copied to clipboard!');
    }
  };

  const downloadRecording = (recordingUrl: string) => {
    alert('📥 Downloading recording...\n\nThis would start downloading the session recording.');
  };

  const getStatusColor = (status: VideoSession['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
  const liveSessions = sessions.filter(s => s.status === 'live');
  const completedSessions = sessions.filter(s => s.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Video Sessions</h1>
                <p className="text-gray-600">Manage your live teaching sessions</p>
              </div>
            </div>
            <button
              onClick={createNewSession}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Session</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingSessions.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Live Now</p>
                <p className="text-2xl font-bold text-gray-900">{liveSessions.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Video className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.reduce((total, session) => total + session.participants.length, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedSessions.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sessions List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Sessions */}
            {liveSessions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Sessions</span>
                </h2>
                <div className="space-y-4">
                  {liveSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onEdit={() => {
                        setEditingSession(session);
                        setShowSessionForm(true);
                      }}
                      onDelete={() => deleteSession(session.id)}
                      onStart={() => joinSession(session.id)}
                      onEnd={() => endSession(session.id)}
                      onCopyLink={() => copyMeetingLink(session.meetingLink)}
                      onViewDetails={() => setSelectedSession(session)}
                      onShare={() => shareSession(session)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
              <div className="space-y-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onEdit={() => {
                        setEditingSession(session);
                        setShowSessionForm(true);
                      }}
                      onDelete={() => deleteSession(session.id)}
                      onStart={() => startSession(session.id)}
                      onCopyLink={() => copyMeetingLink(session.meetingLink)}
                      onViewDetails={() => setSelectedSession(session)}
                      onShare={() => shareSession(session)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                    <p className="text-gray-600 mb-4">Schedule your first video session to start teaching live</p>
                    <button
                      onClick={createNewSession}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Schedule Session
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Sessions */}
            {completedSessions.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sessions</h2>
                <div className="space-y-4">
                  {completedSessions.slice(0, 3).map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onEdit={() => {
                        setEditingSession(session);
                        setShowSessionForm(true);
                      }}
                      onDelete={() => deleteSession(session.id)}
                      onCopyLink={() => copyMeetingLink(session.meetingLink)}
                      onViewDetails={() => setSelectedSession(session)}
                      onShare={() => shareSession(session)}
                      onDownloadRecording={session.recordingUrl ? () => downloadRecording(session.recordingUrl!) : undefined}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {showSessionForm && editingSession && (
              <SessionForm
                session={editingSession}
                onSave={saveSession}
                onCancel={() => {
                  setEditingSession(null);
                  setShowSessionForm(false);
                }}
              />
            )}

            {selectedSession && !showSessionForm && (
              <SessionDetails
                session={selectedSession}
                onClose={() => setSelectedSession(null)}
                onEdit={() => {
                  setEditingSession(selectedSession);
                  setShowSessionForm(true);
                  setSelectedSession(null);
                }}
              />
            )}

            {!showSessionForm && !selectedSession && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={createNewSession}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Plus className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-900">Schedule New Session</span>
                  </button>
                  <button 
                    onClick={() => alert('Opening session settings...')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Settings className="h-5 w-5 text-secondary-600" />
                    <span className="font-medium text-gray-900">Session Settings</span>
                  </button>
                  <button 
                    onClick={() => alert('Exporting session reports...')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <Download className="h-5 w-5 text-success-600" />
                    <span className="font-medium text-gray-900">Export Reports</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Session Card Component
interface SessionCardProps {
  session: VideoSession;
  onEdit: () => void;
  onDelete: () => void;
  onStart?: () => void;
  onEnd?: () => void;
  onCopyLink: () => void;
  onViewDetails: () => void;
  onShare: () => void;
  onDownloadRecording?: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onEdit,
  onDelete,
  onStart,
  onEnd,
  onCopyLink,
  onViewDetails,
  onShare,
  onDownloadRecording
}) => {
  const getStatusColor = (status: VideoSession['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'live': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const sessionDate = new Date(`${date}T${time}`);
    return sessionDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900">{session.title}</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(session.status)}`}>
              {session.status}
            </span>
            {session.isRecurring && (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                Recurring
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{session.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDateTime(session.scheduledDate, session.scheduledTime)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{session.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{session.participants.length}/{session.maxParticipants}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {session.status === 'scheduled' && onStart && (
            <button
              onClick={onStart}
              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
            >
              <Play className="h-3 w-3" />
              <span>Start</span>
            </button>
          )}
          {session.status === 'live' && (
            <>
              {onStart && (
                <button
                  onClick={onStart}
                  className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  <Video className="h-3 w-3" />
                  <span>Join</span>
                </button>
              )}
              {onEnd && (
                <button
                  onClick={onEnd}
                  className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  <span>End</span>
                </button>
              )}
            </>
          )}
          {session.status === 'completed' && onDownloadRecording && (
            <button
              onClick={onDownloadRecording}
              className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <Download className="h-3 w-3" />
              <span>Recording</span>
            </button>
          )}
          <button
            onClick={onCopyLink}
            className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            <Copy className="h-3 w-3" />
            <span>Copy Link</span>
          </button>
          <button
            onClick={onShare}
            className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
          >
            <Share2 className="h-3 w-3" />
            <span>Share</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onViewDetails}
            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-secondary-600 transition-colors"
            title="Edit session"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete session"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Session Form Component (simplified for brevity)
interface SessionFormProps {
  session: VideoSession;
  onSave: (session: VideoSession) => void;
  onCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({ session, onSave, onCancel }) => {
  const [formData, setFormData] = useState<VideoSession>(session);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.scheduledDate || !formData.scheduledTime) {
      alert('Please fill in all required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        {session.id ? 'Edit Session' : 'Create New Session'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time *
            </label>
            <input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              min="15"
              max="180"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Participants
            </label>
            <input
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-4">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span>Save Session</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Session Details Component (simplified for brevity)
interface SessionDetailsProps {
  session: VideoSession;
  onClose: () => void;
  onEdit: () => void;
}

const SessionDetails: React.FC<SessionDetailsProps> = ({ session, onClose, onEdit }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Session Details</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-1">{session.title}</h4>
          <p className="text-sm text-gray-600">{session.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Date & Time:</span>
            <p className="font-medium">
              {new Date(`${session.scheduledDate}T${session.scheduledTime}`).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Duration:</span>
            <p className="font-medium">{session.duration} minutes</p>
          </div>
          <div>
            <span className="text-gray-500">Participants:</span>
            <p className="font-medium">{session.participants.length}/{session.maxParticipants}</p>
          </div>
          <div>
            <span className="text-gray-500">Type:</span>
            <p className="font-medium capitalize">{session.sessionType}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 pt-4">
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Session</span>
          </button>
          <button 
            onClick={() => alert('Sharing session...')}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoSessionManager;