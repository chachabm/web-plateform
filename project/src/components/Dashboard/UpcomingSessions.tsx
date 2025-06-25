import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Video, Play } from 'lucide-react';
import { useVideoSessions } from '../../contexts/VideoSessionContext';
import { useAuth } from '../../contexts/AuthContext';

const UpcomingSessions: React.FC = () => {
  const { user } = useAuth();
  const { userSessions, joinSession } = useVideoSessions();
  
  // Filtrer uniquement les sessions à venir
  const upcomingSessions = userSessions.filter(session => 
    session.status === 'scheduled' || session.status === 'live'
  ).sort((a, b) => {
    const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
    const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
    return dateA.getTime() - dateB.getTime();
  }).slice(0, 3); // Limiter à 3 sessions

  const handleJoinSession = async (sessionId: string) => {
    try {
      await joinSession(sessionId);
      alert(`🎥 Vous avez rejoint la session.\n\nDans une application réelle, cela ouvrirait l'interface de vidéoconférence.`);
    } catch (err) {
      console.error('Erreur lors de la participation à la session:', err);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const sessionDate = new Date(`${date}T${time}`);
    return sessionDate.toLocaleDateString('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (upcomingSessions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Sessions à Venir</h2>
          <Link
            to="/video-sessions"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Voir Tout
          </Link>
        </div>
        <div className="text-center py-8">
          <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">Aucune session à venir</p>
          {user?.role === 'instructor' ? (
            <Link
              to="/video-sessions"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-block"
            >
              Créer une Session
            </Link>
          ) : (
            <Link
              to="/courses"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-block"
            >
              Explorer les Cours
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Sessions à Venir</h2>
        <Link
          to="/video-sessions"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Voir Tout
        </Link>
      </div>
      <div className="space-y-3">
        {upcomingSessions.map((session) => (
          <div key={session.id} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{session.title}</h3>
              <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                session.status === 'live' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {session.status === 'live' ? 'En Direct' : 'Programmée'}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3 line-clamp-1">{session.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDateTime(session.scheduledDate, session.scheduledTime)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{session.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{session.participants.length}/{session.maxParticipants}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                {session.status === 'live' ? (
                  <button
                    onClick={() => handleJoinSession(session.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors flex items-center space-x-1"
                  >
                    <Video className="h-3 w-3" />
                    <span>Rejoindre</span>
                  </button>
                ) : (
                  <Link
                    to={`/video-sessions/${session.id}`}
                    className="bg-primary-600 text-white px-2 py-1 rounded text-xs hover:bg-primary-700 transition-colors flex items-center space-x-1"
                  >
                    <Play className="h-3 w-3" />
                    <span>Détails</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingSessions;