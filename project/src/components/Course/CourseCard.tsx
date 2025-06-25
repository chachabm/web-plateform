import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Users, Award, Heart, Share2, Play, Download, MessageCircle } from 'lucide-react';
import { Course } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/course/${course.id}` } } });
      return;
    }
    
    // Inscription gratuite
    alert(`🎉 Inscription réussie à "${course.title}" !\n\nVous pouvez maintenant accéder à tout le matériel de cours et commencer à apprendre. Vérifiez votre email pour la confirmation d'inscription.`);
    navigate(`/course/${course.id}/learn`);
  };

  const handleQuiz = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/course/${course.id}/quiz` } } });
      return;
    }
    navigate(`/course/${course.id}/quiz`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    alert(`❤️ "${course.title}" a été ajouté à votre liste de souhaits !`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: course.title,
        text: `Découvrez ce cours incroyable de ${course.language} : ${course.title}`,
        url: `${window.location.origin}/course/${course.id}`
      });
    } else {
      // Fallback vers le presse-papiers
      const url = `${window.location.origin}/course/${course.id}`;
      navigator.clipboard.writeText(url).then(() => {
        alert('📋 Lien du cours copié dans le presse-papiers !');
      });
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Créer une notification de téléchargement
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = `📥 Téléchargement du matériel de cours pour "${course.title}"`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
    
    alert(`📥 Début du téléchargement du matériel de cours pour "${course.title}"\n\nInclut : programme, listes de vocabulaire, exercices pratiques et fichiers audio.`);
  };

  const handleChat = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    alert(`💬 Ouverture du chat avec ${course.instructor}...\n\nCeci ouvrirait un message direct avec l'instructeur du cours.`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group transform hover:scale-[1.02]">
      <div className="relative">
        <Link to={`/course/${course.id}`}>
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-3 left-3 flex space-x-2">
          {course.isBestseller && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Bestseller
            </span>
          )}
          {course.isPopular && (
            <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Populaire
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex space-x-2">
          <button
            onClick={handleWishlist}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
            title="Ajouter à la liste de souhaits"
          >
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
          </button>
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
            title="Partager le cours"
          >
            <Share2 className="h-4 w-4 text-gray-600 hover:text-primary-500" />
          </button>
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-xs font-medium">{course.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            {course.level}
          </span>
          <span className="text-xs text-gray-500">{course.language}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          <Link to={`/course/${course.id}`}>{course.title}</Link>
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center space-x-2 mb-3">
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-700">{course.instructor}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="h-4 w-4" />
              <span>{course.lessons} leçons</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>{course.rating}</span>
            <span>({course.reviewCount})</span>
          </div>
          <span className="text-lg font-bold text-green-600">GRATUIT</span>
        </div>

        <div className="flex space-x-2 mb-3">
          <button
            onClick={handleEnroll}
            className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium text-center flex items-center justify-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Commencer l'Apprentissage</span>
          </button>
          <button
            onClick={handleQuiz}
            className="bg-secondary-100 text-secondary-700 py-2 px-4 rounded-lg hover:bg-secondary-200 transition-colors font-medium text-center"
          >
            Quiz
          </button>
        </div>

        {/* Boutons d'Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors text-sm"
            title="Télécharger le matériel de cours"
          >
            <Download className="h-4 w-4" />
            <span>Télécharger</span>
          </button>
          <button
            onClick={handleChat}
            className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors text-sm"
            title="Chatter avec l'instructeur"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </button>
          <Link
            to={`/course/${course.id}`}
            className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 transition-colors text-sm"
          >
            <span>Voir Détails</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;