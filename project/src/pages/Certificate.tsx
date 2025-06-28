import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Download, 
  Share2, 
  Award, 
  Calendar, 
  User, 
  BookOpen, 
  CheckCircle,
  Printer,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Certificate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dans une application réelle, vous récupéreriez ces données depuis votre API
  const certificateData = {
    id: id || '12345',
    courseId: '1',
    courseTitle: 'Espagnol Complet pour Débutants',
    completionDate: new Date().toISOString(),
    instructor: 'Maria Rodriguez',
    hours: 25,
    skills: [
      'Compréhension orale de base',
      'Vocabulaire quotidien',
      'Grammaire fondamentale',
      'Conversation simple'
    ]
  };

  // Vérifier que l'utilisateur est un apprenant
  useEffect(() => {
    if (user && user.role !== 'learner') {
      setError("Les certificats sont uniquement disponibles pour les apprenants");
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Dans une application réelle, vous utiliseriez html2canvas et jsPDF
      // pour générer un PDF du certificat
      
      // Simuler un délai de téléchargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Créer une notification de téléchargement
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = `📥 Téléchargement du certificat pour "${certificateData.courseTitle}"`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
      
      alert(`📥 Certificat téléchargé avec succès pour le cours "${certificateData.courseTitle}"\n\nVous pouvez maintenant l'imprimer ou le partager sur les réseaux sociaux.`);
    } catch (error) {
      console.error('Erreur lors du téléchargement du certificat:', error);
      alert('Une erreur est survenue lors du téléchargement du certificat.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificat de réussite - ${certificateData.courseTitle}`,
        text: `J'ai terminé avec succès le cours "${certificateData.courseTitle}" sur LearnMe !`,
        url: window.location.href
      });
    } else {
      // Fallback vers le presse-papiers
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('📋 Lien du certificat copié dans le presse-papiers !');
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // Rediriger si l'utilisateur n'est pas un apprenant
  if (user.role !== 'learner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Restreint</h1>
          <p className="text-gray-600 mb-6">
            Les certificats sont uniquement disponibles pour les apprenants. En tant que {user.role === 'instructor' ? 'formateur' : 'administrateur'}, vous n'avez pas accès à cette fonctionnalité.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Retour</span>
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Printer className="h-5 w-5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span>Partager</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Téléchargement...</span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  <span>Télécharger PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Certificat */}
        <div 
          ref={certificateRef}
          className="bg-white rounded-xl shadow-lg overflow-hidden border-8 border-double border-primary-100 p-8 print:border-8 print:border-double print:border-primary-100 print:shadow-none"
        >
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-4 rounded-full">
                <Award className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificat de Réussite</h1>
            <p className="text-xl text-gray-600">Ce certificat est décerné à</p>
            <h2 className="text-4xl font-bold text-primary-600 mt-4 mb-2 font-serif">{user.name}</h2>
            <p className="text-xl text-gray-600">pour avoir complété avec succès</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-6">{certificateData.courseTitle}</h3>
            
            <div className="w-1/2 mx-auto border-t-2 border-gray-200 my-6"></div>
            
            <div className="flex justify-between items-center max-w-md mx-auto mb-8">
              <div className="text-center">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-gray-600">Date de délivrance</p>
                <p className="font-medium">{formatDate(certificateData.completionDate)}</p>
              </div>
              <div className="text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-gray-600">Heures de cours</p>
                <p className="font-medium">{certificateData.hours} heures</p>
              </div>
              <div className="text-center">
                <User className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                <p className="text-sm text-gray-600">Instructeur</p>
                <p className="font-medium">{certificateData.instructor}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 max-w-2xl mx-auto mb-8">
              <h4 className="font-semibold text-gray-900 mb-3">Compétences acquises</h4>
              <div className="grid grid-cols-2 gap-2">
                {certificateData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-end max-w-2xl mx-auto">
              <div className="text-center">
                <div className="h-0.5 w-40 bg-gray-400 mb-2"></div>
                <p className="text-gray-600 font-medium">{certificateData.instructor}</p>
                <p className="text-sm text-gray-500">Instructeur</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                  ID: CERT-{certificateData.id}
                </div>
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500">QR Code</span>
                </div>
              </div>
              <div className="text-center">
                <div className="h-0.5 w-40 bg-gray-400 mb-2"></div>
                <p className="text-gray-600 font-medium">LearnMe</p>
                <p className="text-sm text-gray-500">Plateforme d'Apprentissage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 print:hidden">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">À propos de ce certificat</h2>
          <p className="text-gray-600 mb-4">
            Ce certificat vérifie que <strong>{user.name}</strong> a complété avec succès le cours <strong>{certificateData.courseTitle}</strong> sur la plateforme LearnMe. 
            Ce cours représente {certificateData.hours} heures d'étude et couvre les compétences essentielles en {certificateData.courseTitle.split(' ')[0]}.
          </p>
          <p className="text-gray-600 mb-4">
            Chaque certificat LearnMe est unique et peut être vérifié en ligne en utilisant l'identifiant du certificat. 
            Les employeurs et institutions peuvent vérifier l'authenticité de ce certificat en visitant <span className="text-primary-600">verify.learnme.com</span> et en saisissant l'identifiant du certificat.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Partagez votre réussite</h3>
            <p className="text-blue-700 text-sm">
              Ajoutez ce certificat à votre profil LinkedIn ou à votre CV pour mettre en valeur vos compétences linguistiques auprès des employeurs potentiels.
            </p>
            <button
              onClick={() => alert('Cette fonctionnalité vous permettrait d\'ajouter directement le certificat à votre profil LinkedIn.')}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Ajouter à LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;