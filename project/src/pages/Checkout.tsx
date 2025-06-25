import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowLeft, ShieldCheck, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CheckoutForm from '../components/Payment/CheckoutForm';
import stripePromise from '../utils/stripe';
import { mockCourses } from '../data/mockData';

const Checkout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Dans une application réelle, vous feriez une requête API pour obtenir les détails du cours
    // Ici, nous utilisons les données mockées
    const foundCourse = mockCourses.find(c => c.id === id);
    
    if (foundCourse) {
      // Ajouter un prix pour la démonstration
      setCourse({
        ...foundCourse,
        price: 49.99,
        originalPrice: 99.99,
        discount: 50
      });
    } else {
      setError('Cours non trouvé');
    }
    
    setLoading(false);
  }, [id]);

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
    // Dans une application réelle, vous enregistreriez l'inscription au cours dans la base de données
  };

  const handleCancel = () => {
    navigate(`/course/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des informations de paiement...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-6">{error || 'Une erreur est survenue'}</p>
          <Link
            to="/courses"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retour aux cours
          </Link>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paiement réussi !</h1>
          <p className="text-gray-600 mb-6">
            Merci pour votre achat. Vous avez maintenant accès complet à <strong>{course.title}</strong>.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Détails de la commande</h3>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Cours :</span>
              <span>{course.title}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Montant :</span>
              <span>{(course.price * 1.2).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date :</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="space-y-4">
            <Link
              to={`/course/${course.id}/learn`}
              className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Commencer à apprendre
            </Link>
            <Link
              to="/dashboard"
              className="block w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Aller au tableau de bord
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/course/${course.id}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Retour au cours</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Formulaire de paiement */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Finaliser votre achat</h1>
              
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  courseId={course.id}
                  courseName={course.title}
                  price={course.price}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleCancel}
                />
              </Elements>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la commande</h2>
              
              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600">Par {course.instructor}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{course.rating} ({course.reviewCount} avis)</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Prix du cours</span>
                  <span className="font-medium">
                    {course.originalPrice ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">{course.originalPrice.toFixed(2)} €</span>
                        <span>{course.price.toFixed(2)} €</span>
                      </>
                    ) : (
                      <span>{course.price.toFixed(2)} €</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span className="font-medium">{(course.price * 0.2).toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span>{(course.price * 1.2).toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ce qui est inclus</h2>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Accès à vie au cours</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{course.lessons} leçons vidéo</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Ressources téléchargeables</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Accès aux sessions en direct</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Certificat d'achèvement</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded-xl p-4 flex items-center space-x-3">
              <ShieldCheck className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Garantie de remboursement de 30 jours</p>
                <p className="text-xs text-gray-600">Si vous n'êtes pas satisfait, nous vous remboursons intégralement.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;