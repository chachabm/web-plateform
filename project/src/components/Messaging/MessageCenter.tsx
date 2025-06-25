import React, { useState } from 'react';
import { MessageCircle, Search, Users, BookOpen, Bell, Settings, Plus, Filter } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ChatWindow from './ChatWindow';

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: 'instructor' | 'student';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  courseTitle?: string;
  isOnline: boolean;
}

const MessageCenter: React.FC = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'instructors' | 'students'>('all');

  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      participantId: 'instructor-1',
      participantName: 'Maria Rodriguez',
      participantAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      participantRole: 'instructor',
      lastMessage: 'Excellente question ! Laissez-moi vous expliquer cela en détail.',
      lastMessageTime: new Date(Date.now() - 1800000).toISOString(),
      unreadCount: 2,
      courseTitle: 'Espagnol Complet pour Débutants',
      isOnline: true
    },
    {
      id: '2',
      participantId: 'student-1',
      participantName: 'Sophie Martin',
      participantAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      participantRole: 'student',
      lastMessage: 'Merci pour l\'aide ! Je vais essayer les exercices que vous avez suggérés.',
      lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 0,
      courseTitle: 'Espagnol Complet pour Débutants',
      isOnline: false
    },
    {
      id: '3',
      participantId: 'instructor-2',
      participantName: 'Pierre Dubois',
      participantAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      participantRole: 'instructor',
      lastMessage: 'Bonjour ! N\'hésitez pas si vous avez des questions sur la prononciation française.',
      lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
      unreadCount: 1,
      courseTitle: 'Maîtrise de la Conversation Française',
      isOnline: true
    },
    {
      id: '4',
      participantId: 'student-2',
      participantName: 'Jean Dupont',
      participantAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      participantRole: 'student',
      lastMessage: 'Pouvez-vous me recommander des ressources supplémentaires pour pratiquer ?',
      lastMessageTime: new Date(Date.now() - 172800000).toISOString(),
      unreadCount: 0,
      courseTitle: 'Espagnol Complet pour Débutants',
      isOnline: false
    }
  ]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterBy === 'all' || 
                         (filterBy === 'instructors' && conv.participantRole === 'instructor') ||
                         (filterBy === 'students' && conv.participantRole === 'student');
    
    return matchesSearch && matchesFilter;
  });

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    if (diffInMinutes < 10080) return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
    return time.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);

  const handleStartNewConversation = () => {
    alert('🆕 Nouvelle conversation...\n\nCeci ouvrirait une liste de vos instructeurs et camarades de classe pour démarrer une nouvelle conversation.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 p-3 rounded-lg">
                <MessageCircle className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Centre de Messages</h1>
                <p className="text-gray-600">
                  Communiquez avec vos instructeurs et camarades de classe
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {totalUnreadCount > 0 && (
                <div className="flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-2 rounded-lg">
                  <Bell className="h-4 w-4" />
                  <span className="font-medium">{totalUnreadCount} non lu{totalUnreadCount > 1 ? 's' : ''}</span>
                </div>
              )}
              
              <button
                onClick={handleStartNewConversation}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Nouvelle Conversation</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des Conversations */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Barre de recherche et filtres */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher des conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as 'all' | 'instructors' | 'students')}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">Toutes les conversations</option>
                    <option value="instructors">Instructeurs seulement</option>
                    <option value="students">Étudiants seulement</option>
                  </select>
                </div>
              </div>

              {/* Liste des conversations */}
              <div className="max-h-96 overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selectedConversation?.id === conversation.id ? 'bg-primary-50 border-primary-200' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <img
                          src={conversation.participantAvatar}
                          alt={conversation.participantName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        {conversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900 truncate">
                            {conversation.participantName}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            conversation.participantRole === 'instructor' 
                              ? 'bg-secondary-100 text-secondary-700' 
                              : 'bg-primary-100 text-primary-700'
                          }`}>
                            {conversation.participantRole === 'instructor' ? 'Instructeur' : 'Étudiant'}
                          </span>
                          {conversation.courseTitle && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <BookOpen className="h-3 w-3" />
                              <span className="truncate">{conversation.courseTitle}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full ml-2">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {filteredConversations.length === 0 && (
                  <div className="p-8 text-center">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune conversation trouvée
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? 'Essayez un autre terme de recherche' : 'Commencez une nouvelle conversation'}
                    </p>
                    <button
                      onClick={handleStartNewConversation}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Nouvelle Conversation
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Zone de contenu principal */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center">
                  <img
                    src={selectedConversation.participantAvatar}
                    alt={selectedConversation.participantName}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedConversation.participantName}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      selectedConversation.participantRole === 'instructor' 
                        ? 'bg-secondary-100 text-secondary-700' 
                        : 'bg-primary-100 text-primary-700'
                    }`}>
                      {selectedConversation.participantRole === 'instructor' ? 'Instructeur' : 'Étudiant'}
                    </span>
                    {selectedConversation.isOnline && (
                      <span className="inline-flex items-center space-x-1 text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>En ligne</span>
                      </span>
                    )}
                  </div>
                  {selectedConversation.courseTitle && (
                    <div className="flex items-center justify-center space-x-2 text-gray-600 mb-6">
                      <BookOpen className="h-4 w-4" />
                      <span>{selectedConversation.courseTitle}</span>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      // Ouvrir la fenêtre de chat
                      setSelectedConversation(null);
                    }}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Ouvrir la Conversation
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <MessageCircle className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Sélectionnez une conversation
                </h3>
                <p className="text-gray-600 mb-6">
                  Choisissez une conversation dans la liste pour commencer à discuter avec vos instructeurs et camarades de classe.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Instructeurs</h4>
                    <p className="text-sm text-gray-600">
                      Posez des questions et obtenez de l'aide personnalisée
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <BookOpen className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Camarades</h4>
                    <p className="text-sm text-gray-600">
                      Étudiez ensemble et partagez vos expériences
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fenêtre de Chat */}
      {selectedConversation && (
        <ChatWindow
          recipientId={selectedConversation.participantId}
          recipientName={selectedConversation.participantName}
          recipientAvatar={selectedConversation.participantAvatar}
          recipientRole={selectedConversation.participantRole}
          courseTitle={selectedConversation.courseTitle}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </div>
  );
};

export default MessageCenter;