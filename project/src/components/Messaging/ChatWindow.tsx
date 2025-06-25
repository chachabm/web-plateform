import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, MoreVertical, X, Phone, Video } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
}

interface ChatWindowProps {
  recipientId: string;
  recipientName: string;
  recipientAvatar: string;
  recipientRole: 'instructor' | 'student';
  onClose: () => void;
  courseTitle?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  recipientId,
  recipientName,
  recipientAvatar,
  recipientRole,
  onClose,
  courseTitle
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: recipientId,
      senderName: recipientName,
      senderAvatar: recipientAvatar,
      content: `Bonjour ! Je suis ravi de vous aider avec ${courseTitle || 'votre apprentissage'}. N'hésitez pas à me poser des questions !`,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'text',
      isRead: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar || '',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text',
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simuler une réponse automatique de l'instructeur
    if (recipientRole === 'instructor') {
      setIsTyping(true);
      setTimeout(() => {
        const responses = [
          "Excellente question ! Laissez-moi vous expliquer cela en détail.",
          "C'est un point important que beaucoup d'étudiants trouvent difficile.",
          "Je vais vous donner quelques conseils pratiques pour cela.",
          "Merci pour votre question. Voici ce que je recommande :",
          "C'est exactement le type de question qui montre que vous progressez bien !"
        ];

        const autoResponse: Message = {
          id: (Date.now() + 1).toString(),
          senderId: recipientId,
          senderName: recipientName,
          senderAvatar: recipientAvatar,
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toISOString(),
          type: 'text',
          isRead: false
        };

        setMessages(prev => [...prev, autoResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar || '',
      content: `Fichier partagé : ${file.name}`,
      timestamp: new Date().toISOString(),
      type: 'file',
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    
    // Notification de partage de fichier
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = `📎 Fichier "${file.name}" partagé avec ${recipientName}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleVideoCall = () => {
    alert(`📹 Démarrage d'un appel vidéo avec ${recipientName}...\n\nCeci ouvrirait une session de vidéoconférence pour une conversation en temps réel.`);
  };

  const handleVoiceCall = () => {
    alert(`📞 Démarrage d'un appel vocal avec ${recipientName}...\n\nCeci ouvrirait une session audio pour une conversation vocale.`);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* En-tête du Chat */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <img
              src={recipientAvatar}
              alt={recipientName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{recipientName}</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  recipientRole === 'instructor' 
                    ? 'bg-secondary-100 text-secondary-700' 
                    : 'bg-primary-100 text-primary-700'
                }`}>
                  {recipientRole === 'instructor' ? 'Instructeur' : 'Étudiant'}
                </span>
                {courseTitle && (
                  <span className="text-xs text-gray-500">• {courseTitle}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleVoiceCall}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Appel vocal"
            >
              <Phone className="h-5 w-5" />
            </button>
            <button
              onClick={handleVideoCall}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Appel vidéo"
            >
              <Video className="h-5 w-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Plus d'options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Zone des Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => {
            const isOwnMessage = message.senderId === user?.id;
            const showDate = index === 0 || 
              formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center my-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                    isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    {!isOwnMessage && (
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    
                    <div className={`px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.type === 'file' && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm font-medium">{message.fileName}</span>
                        </div>
                      )}
                      
                      <p className="text-sm">{message.content}</p>
                      
                      <div className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                        {isOwnMessage && (
                          <span className="ml-1">
                            {message.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <img
                  src={recipientAvatar}
                  alt={recipientName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de Saisie */}
        <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Joindre un fichier"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Ajouter un emoji"
            >
              <Smile className="h-5 w-5" />
            </button>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;