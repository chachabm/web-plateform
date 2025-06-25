import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Reply, Flag, MoreVertical, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: 'student' | 'instructor' | 'admin';
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
  isLiked: boolean;
  isDisliked: boolean;
  isPinned: boolean;
  isInstructorResponse: boolean;
}

interface CommentSectionProps {
  courseId: string;
  lessonId?: string;
  title: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ courseId, lessonId, title }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: 'instructor-1',
      userName: 'Maria Rodriguez',
      userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      userRole: 'instructor',
      content: 'Bienvenue dans cette section ! N\'hésitez pas à poser vos questions ici. Je réponds généralement dans les 24 heures.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      likes: 15,
      dislikes: 0,
      replies: [],
      isLiked: false,
      isDisliked: false,
      isPinned: true,
      isInstructorResponse: true
    },
    {
      id: '2',
      userId: 'student-1',
      userName: 'Jean Dupont',
      userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      userRole: 'student',
      content: 'Excellente explication ! J\'ai enfin compris la différence entre ser et estar. Merci beaucoup !',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      likes: 8,
      dislikes: 0,
      replies: [
        {
          id: '2-1',
          userId: 'instructor-1',
          userName: 'Maria Rodriguez',
          userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          userRole: 'instructor',
          content: 'Je suis ravie que cela vous aide ! C\'est effectivement un point difficile pour beaucoup d\'étudiants.',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          likes: 5,
          dislikes: 0,
          replies: [],
          isLiked: false,
          isDisliked: false,
          isPinned: false,
          isInstructorResponse: true
        }
      ],
      isLiked: true,
      isDisliked: false,
      isPinned: false,
      isInstructorResponse: false
    },
    {
      id: '3',
      userId: 'student-2',
      userName: 'Sophie Martin',
      userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      userRole: 'student',
      content: 'Quelqu\'un pourrait-il m\'expliquer la conjugaison du verbe "tener" au présent ? J\'ai du mal avec les formes irrégulières.',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      likes: 3,
      dislikes: 0,
      replies: [],
      isLiked: false,
      isDisliked: false,
      isPinned: false,
      isInstructorResponse: false
    }
  ]);

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || '',
      userRole: user.role as 'student' | 'instructor' | 'admin',
      content: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isLiked: false,
      isDisliked: false,
      isPinned: false,
      isInstructorResponse: user.role === 'instructor'
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');

    // Notification de nouveau commentaire
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = '💬 Commentaire publié avec succès !';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || '',
      userRole: user.role as 'student' | 'instructor' | 'admin',
      content: replyContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isLiked: false,
      isDisliked: false,
      isPinned: false,
      isInstructorResponse: user.role === 'instructor'
    };

    setComments(prev => prev.map(comment => 
      comment.id === parentId 
        ? { ...comment, replies: [...comment.replies, reply] }
        : comment
    ));

    setReplyContent('');
    setReplyingTo(null);
  };

  const handleLike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? {
                      ...reply,
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                      dislikes: reply.isDisliked ? reply.dislikes - 1 : reply.dislikes,
                      isLiked: !reply.isLiked,
                      isDisliked: false
                    }
                  : reply
              )
            }
          : comment
      ));
    } else {
      setComments(prev => prev.map(comment => 
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes,
              isLiked: !comment.isLiked,
              isDisliked: false
            }
          : comment
      ));
    }
  };

  const handleDislike = (commentId: string, isReply: boolean = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? {
                      ...reply,
                      dislikes: reply.isDisliked ? reply.dislikes - 1 : reply.dislikes + 1,
                      likes: reply.isLiked ? reply.likes - 1 : reply.likes,
                      isDisliked: !reply.isDisliked,
                      isLiked: false
                    }
                  : reply
              )
            }
          : comment
      ));
    } else {
      setComments(prev => prev.map(comment => 
        comment.id === commentId
          ? {
              ...comment,
              dislikes: comment.isDisliked ? comment.dislikes - 1 : comment.dislikes + 1,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes,
              isDisliked: !comment.isDisliked,
              isLiked: false
            }
          : comment
      ));
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'instructor': return 'bg-secondary-100 text-secondary-700';
      case 'admin': return 'bg-red-100 text-red-700';
      default: return 'bg-primary-100 text-primary-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'instructor': return 'Instructeur';
      case 'admin': return 'Admin';
      default: return 'Étudiant';
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      case 'popular':
        return (b.likes - b.dislikes) - (a.likes - a.dislikes);
      default: // newest
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
  });

  // Séparer les commentaires épinglés
  const pinnedComments = sortedComments.filter(comment => comment.isPinned);
  const regularComments = sortedComments.filter(comment => !comment.isPinned);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-6 w-6 text-primary-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Commentaires {lessonId ? 'de la leçon' : 'du cours'}
          </h3>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {comments.length + comments.reduce((total, comment) => total + comment.replies.length, 0)}
          </span>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'popular')}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="newest">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="popular">Plus populaires</option>
        </select>
      </div>

      {/* Formulaire de nouveau commentaire */}
      {user && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex space-x-3">
            <img
              src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Partagez vos pensées ou posez une question..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="text-sm text-gray-500">
                  Soyez respectueux et constructif dans vos commentaires
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Publier
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-6">
        {/* Commentaires épinglés */}
        {pinnedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onDislike={handleDislike}
            onReply={setReplyingTo}
            replyingTo={replyingTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            onSubmitReply={handleSubmitReply}
            formatTimeAgo={formatTimeAgo}
            getRoleColor={getRoleColor}
            getRoleLabel={getRoleLabel}
            isPinned={true}
          />
        ))}

        {/* Commentaires réguliers */}
        {regularComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={handleLike}
            onDislike={handleDislike}
            onReply={setReplyingTo}
            replyingTo={replyingTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            onSubmitReply={handleSubmitReply}
            formatTimeAgo={formatTimeAgo}
            getRoleColor={getRoleColor}
            getRoleLabel={getRoleLabel}
          />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun commentaire pour le moment</h4>
            <p className="text-gray-600">Soyez le premier à partager vos pensées !</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour un commentaire individuel
interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string, isReply?: boolean, parentId?: string) => void;
  onDislike: (commentId: string, isReply?: boolean, parentId?: string) => void;
  onReply: (commentId: string | null) => void;
  replyingTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onSubmitReply: (e: React.FormEvent, parentId: string) => void;
  formatTimeAgo: (timestamp: string) => string;
  getRoleColor: (role: string) => string;
  getRoleLabel: (role: string) => string;
  isPinned?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onLike,
  onDislike,
  onReply,
  replyingTo,
  replyContent,
  setReplyContent,
  onSubmitReply,
  formatTimeAgo,
  getRoleColor,
  getRoleLabel,
  isPinned = false
}) => {
  const { user } = useAuth();

  return (
    <div className={`${isPinned ? 'bg-yellow-50 border border-yellow-200 rounded-lg p-4' : ''}`}>
      {isPinned && (
        <div className="flex items-center space-x-2 mb-3">
          <Heart className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Commentaire épinglé</span>
        </div>
      )}
      
      <div className="flex space-x-3">
        <img
          src={comment.userAvatar}
          alt={comment.userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">{comment.userName}</span>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(comment.userRole)}`}>
              {getRoleLabel(comment.userRole)}
            </span>
            {comment.isInstructorResponse && (
              <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full">
                Réponse officielle
              </span>
            )}
            <span className="text-sm text-gray-500">{formatTimeAgo(comment.timestamp)}</span>
          </div>
          
          <p className="text-gray-700 mb-3">{comment.content}</p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(comment.id)}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.isLiked ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
              <span>{comment.likes}</span>
            </button>
            
            <button
              onClick={() => onDislike(comment.id)}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.isDisliked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <ThumbsDown className={`h-4 w-4 ${comment.isDisliked ? 'fill-current' : ''}`} />
              <span>{comment.dislikes}</span>
            </button>
            
            <button
              onClick={() => onReply(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              <Reply className="h-4 w-4" />
              <span>Répondre</span>
            </button>
            
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Flag className="h-4 w-4" />
            </button>
            
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
          
          {/* Formulaire de réponse */}
          {replyingTo === comment.id && user && (
            <form onSubmit={(e) => onSubmitReply(e, comment.id)} className="mt-4">
              <div className="flex space-x-3">
                <img
                  src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Écrivez votre réponse..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <button
                      type="submit"
                      disabled={!replyContent.trim()}
                      className="bg-primary-600 text-white px-3 py-1 rounded text-sm hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Répondre
                    </button>
                    <button
                      type="button"
                      onClick={() => onReply(null)}
                      className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
          
          {/* Réponses */}
          {comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex space-x-3 pl-4 border-l-2 border-gray-200">
                  <img
                    src={reply.userAvatar}
                    alt={reply.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">{reply.userName}</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(reply.userRole)}`}>
                        {getRoleLabel(reply.userRole)}
                      </span>
                      {reply.isInstructorResponse && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded-full">
                          Réponse officielle
                        </span>
                      )}
                      <span className="text-xs text-gray-500">{formatTimeAgo(reply.timestamp)}</span>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-2">{reply.content}</p>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => onLike(reply.id, true, comment.id)}
                        className={`flex items-center space-x-1 text-xs transition-colors ${
                          reply.isLiked ? 'text-primary-600' : 'text-gray-500 hover:text-primary-600'
                        }`}
                      >
                        <ThumbsUp className={`h-3 w-3 ${reply.isLiked ? 'fill-current' : ''}`} />
                        <span>{reply.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => onDislike(reply.id, true, comment.id)}
                        className={`flex items-center space-x-1 text-xs transition-colors ${
                          reply.isDisliked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                        }`}
                      >
                        <ThumbsDown className={`h-3 w-3 ${reply.isDisliked ? 'fill-current' : ''}`} />
                        <span>{reply.dislikes}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;