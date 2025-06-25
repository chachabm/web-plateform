import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  MessageCircle, 
  Download, 
  Share2, 
  Copy, 
  Play, 
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useVideoSessions } from '../contexts/VideoSessionContext';
import { useAuth } from '../contexts/AuthContext';

const VideoSessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getSessionById, 
    joinSession, 
    leaveSession, 
    startSession, 
    endSession,
    isLoading,
    error
  } = useVideoSessions();
  
  const [session, setSession] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: 'System',
      message: 'Bienvenue dans le chat de la session. Vous pouvez poser vos questions ici.',
      timestamp: new Date().toISOString(),
      isSystem: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState<'join' | 'leave' | null>(null);
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      const sessionData = getSessionById(id);
      if (sessionData) {
        setSession(sessionData);
      } else {
        // Session non trouvée, rediriger
        navigate('/dashboard');
      }
    }
  }, [id, getSessionById, navigate]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la session...</p>
        </div>
      </div>
    );
  }

  const handleJoinSession = async () => {
    try {
      await joinSession(session.id);
      setJoinSuccess(true);
      setShowConfirmation(null);
      
      // Ajouter un message au chat
      const joinMessage = {
        id: Date.now(),
        user: 'System',
        message: `${user?.name} a rejoint la session.`,
        timestamp: new Date().toISOString(),
        isSystem: true
      };
      setChatMessages(prev => [...prev, joinMessage]);
      
      // Simuler l'ouverture d'une fenêtre de vidéoconférence
      alert(`🎥 Vous avez rejoint la session "${session.title}".\n\nDans une application réelle, cela ouvrirait l'interface de vidéoconférence.`);
    } catch (err) {
      console.error('Erreur lors de la participation à la session:', err);
    }
  };

  const handleLeaveSession = async () => {
    try {
      await leaveSession(session.id);
      setShowConfirmation(null);
      
      // Ajouter un message au chat
      const leaveMessage = {
        id: Date.now(),
        user: 'System',
        message: `${user?.name} a quitté la session.`,
        timestamp: new Date().toISOString(),
        isSystem: true
      };
      setChatMessages(prev => [...prev, leaveMessage]);
      
      alert('Vous avez quitté la session.');
    } catch (err) {
      console.error('Erreur lors de la sortie de la session:', err);
    }
  };

  const handleStartSession = async () => {
    try {
      await startSession(session.id);
      
      // Ajouter un message au chat
      const startMessage = {
        id: Date.now(),
        user: 'System',
        message: 'La session a commencé.',
        timestamp: new Date().toISOString(),
        isSystem: true
      };
      setChatMessages(prev => [...prev, startMessage]);
      
      alert(`🎬 La session "${session.title}" a démarré.\n\nDans une application réelle, cela ouvrirait l'interface de vidéoconférence pour l'instructeur.`);
    } catch (err) {
      console.error('Erreur lors du démarrage de la session:', err);
    }
  };

  const handleEndSession = async () => {
    try {
      await endSession(session.id);
      
      // Ajouter un message au chat
      const endMessage = {
        id: Date.now(),
        user: 'System',
        message: 'La session est terminée.',
        timestamp: new Date().toISOString(),
        isSystem: true
      };
      setChatMessages(prev => [...prev, endMessage]);
      
      alert('La session est maintenant terminée.');
    } catch (err) {
      console.error('Erreur lors de la fin de la session:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(session.meetingLink);
    alert('Lien de la session copié dans le presse-papiers.');
  };

  const handleShareSession = () => {
    const shareText = `Rejoignez ma session "${session.title}" le ${new Date(`${session.scheduledDate}T${session.scheduledTime}`).toLocaleDateString()}`;
    
    if (navigator.share) {
      navigator.share({
        title: session.title,
        text: shareText,
        url: session.meetingLink
      });
    } else {
      navigator.clipboard.writeText(`${shareText}\n${session.meetingLink}`);
      alert('Détails de la session copiés dans le presse-papiers.');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      user: user?.name || 'Utilisateur',
      message: newMessage,
      timestamp: new Date().toISOString(),
      isSystem: false
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simuler une réponse de l'instructeur
    if (session.instructorId !== user?.id) {
      setTimeout(() => {
        const instructorResponses = [
          "Merci pour votre question ! Je vais vous aider avec ça.",
          "Excellente question sur ce sujet.",
          "Laissez-moi vous donner quelques informations utiles.",
          "Je comprends votre préoccupation. Voici ce que je recommande :",
          "C'est un excellent point ! Beaucoup d'étudiants posent cette question."
        ];
        
        const instructorMessage = {
          id: Date.now() + 1,
          user: session.instructorName,
          message: instructorResponses[Math.floor(Math.random() * instructorResponses.length)],
          timestamp: new Date().toISOString(),
          isSystem: false
        };
        
        setChatMessages(prev => [...prev, instructorMessage]);
      }, 2000);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const sessionDate = new Date(`${date}T${time}`);
    return sessionDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isParticipant = session.participants.some((p: any) => p.id === user?.id);
  const isInstructor = session.instructorId === user?.id;
  const canJoin = !isParticipant && session.status === 'scheduled';
  const canStart = isInstructor && session.status === 'scheduled';
  const canEnd = isInstructor && session.status === 'live';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{session.title}</h1>
            <p className="text-gray-600">{session.courseName}</p>
          </div>
        </div>

        {/* Message de succès */}
        {joinSuccess && (
          <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Vous avez rejoint cette session avec succès !
          </div>
        )}

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Détails de la session */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Détails de la Session</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  session.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  session.status === 'live' ? 'bg-green-100 text-green-800' :
                  session.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {session.status === 'scheduled' ? 'Programmée' :
                   session.status === 'live' ? 'En direct' :
                   session.status === 'completed' ? 'Terminée' :
                   'Annulée'}
                </div>
              </div>

              <div className="prose max-w-none text-gray-700 mb-6">
                <p>{session.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date et Heure</p>
                    <p className="font-medium text-gray-900">
                      {formatDateTime(session.scheduledDate, session.scheduledTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Durée</p>
                    <p className="font-medium text-gray-900">{session.duration} minutes</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium text-gray-900">
                      {session.participants.length}/{session.maxParticipants}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Video className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type de Session</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {session.sessionType === 'live' ? 'En direct' :
                       session.sessionType === 'recorded' ? 'Enregistrée' :
                       'Hybride'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4">
                {canJoin && (
                  <button
                    onClick={() => setShowConfirmation('join')}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Rejoindre la Session</span>
                  </button>
                )}

                {isParticipant && session.status === 'live' && (
                  <button
                    onClick={() => handleJoinSession()}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Video className="h-5 w-5" />
                    <span>Rejoindre le Direct</span>
                  </button>
                )}

                {isParticipant && session.status !== 'completed' && (
                  <button
                    onClick={() => setShowConfirmation('leave')}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <XCircle className="h-5 w-5" />
                    <span>Quitter la Session</span>
                  </button>
                )}

                {canStart && (
                  <button
                    onClick={handleStartSession}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Démarrer la Session</span>
                  </button>
                )}

                {canEnd && (
                  <button
                    onClick={handleEndSession}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <XCircle className="h-5 w-5" />
                    <span>Terminer la Session</span>
                  </button>
                )}

                <button
                  onClick={handleCopyLink}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                >
                  <Copy className="h-5 w-5" />
                  <span>Copier le Lien</span>
                </button>

                <button
                  onClick={handleShareSession}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Partager</span>
                </button>

                {session.status === 'completed' && session.recordingUrl && (
                  <button
                    onClick={() => alert('Téléchargement de l\'enregistrement...')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Télécharger l'Enregistrement</span>
                  </button>
                )}
              </div>
            </div>

            {/* Matériaux de Session */}
            {session.materials && session.materials.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Matériaux de Session</h2>
                <div className="space-y-4">
                  {session.materials.map((material: any) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{material.name}</p>
                          <p className="text-sm text-gray-500">{material.size}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Téléchargement de ${material.name}...`)}
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat de Session */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Chat de Session</h2>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                >
                  {showChat ? 'Masquer' : 'Afficher'}
                </button>
              </div>

              {showChat ? (
                <div className="space-y-4">
                  <div className="h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg space-y-4">
                    {chatMessages.map((message: any) => (
                      <div key={message.id} className={`flex ${message.isSystem ? 'justify-center' : 'items-start'}`}>
                        {!message.isSystem && (
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.user === user?.name
                              ? 'bg-primary-600 text-white ml-auto'
                              : 'bg-gray-200 text-gray-900'
                          }`}>
                            <p className="font-medium text-sm">{message.user}</p>
                            <p>{message.message}</p>
                            <p className={`text-xs mt-1 ${
                              message.user === user?.name ? 'text-primary-100' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        )}
                        {message.isSystem && (
                          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
                            {message.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Envoyer
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Cliquez sur "Afficher" pour accéder au chat de la session
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructeur */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructeur</h3>
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                  alt={session.instructorName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">{session.instructorName}</p>
                  <p className="text-sm text-gray-500">Expert en {session.courseName}</p>
                  <button
                    onClick={() => alert('Message envoyé à l\'instructeur')}
                    className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Contacter
                  </button>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Participants ({session.participants.length}/{session.maxParticipants})
              </h3>
              {session.participants.length > 0 ? (
                <div className="space-y-4">
                  {session.participants.map((participant: any) => (
                    <div key={participant.id} className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {participant.status === 'joined' && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{participant.name}</p>
                        <p className="text-xs text-gray-500">
                          {participant.status === 'registered' ? 'Inscrit' :
                           participant.status === 'joined' ? 'Connecté' :
                           'Déconnecté'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  Aucun participant inscrit pour le moment
                </p>
              )}
            </div>

            {/* Informations Supplémentaires */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cours</span>
                  <span className="font-medium text-gray-900">{session.courseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium text-gray-900 capitalize">{session.sessionType}</span>
                </div>
                {session.isRecurring && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Récurrence</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {session.recurringPattern === 'weekly' ? 'Hebdomadaire' :
                       session.recurringPattern === 'biweekly' ? 'Bimensuelle' :
                       'Mensuelle'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Lien de Réunion</span>
                  <button
                    onClick={handleCopyLink}
                    className="text-primary-600 hover:text-primary-700 transition-colors text-sm font-medium"
                  >
                    Copier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {showConfirmation === 'join' ? 'Rejoindre la Session' : 'Quitter la Session'}
            </h3>
            <p className="text-gray-700 mb-6">
              {showConfirmation === 'join' 
                ? `Êtes-vous sûr de vouloir rejoindre la session "${session.title}" ?` 
                : `Êtes-vous sûr de vouloir quitter la session "${session.title}" ?`}
            </p>
            <div className="flex items-center space-x-3 justify-end">
              <button
                onClick={() => setShowConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={showConfirmation === 'join' ? handleJoinSession : handleLeaveSession}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showConfirmation === 'join'
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {showConfirmation === 'join' ? 'Rejoindre' : 'Quitter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSessionDetail;