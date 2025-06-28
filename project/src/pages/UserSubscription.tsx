import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  RefreshCw, 
  Download, 
  Award,
  Shield,
  AlertTriangle,
  Settings,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  paymentMethod: {
    brand: string;
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  };
}

const UserSubscription: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showUpdatePaymentModal, setShowUpdatePaymentModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Vérifier que l'utilisateur est un apprenant
    if (user && user.role !== 'learner') {
      setError("Les abonnements sont uniquement disponibles pour les apprenants");
      setLoading(false);
      return;
    }

    // Simuler le chargement des données d'abonnement depuis l'API
    const fetchSubscription = async () => {
      try {
        // En mode démo, utiliser des données fictives
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simuler un abonnement actif
        const mockSubscription: Subscription = {
          id: 'sub_1234567890',
          planId: 'premium',
          planName: 'Premium',
          status: 'active',
          currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 jours avant
          currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 jours après
          cancelAtPeriodEnd: false,
          price: 1499,
          interval: 'month',
          features: [
            'Accès à tous les cours gratuits',
            'Accès aux forums communautaires',
            'Suivi de progression avancé',
            'Accès à tous les quiz',
            'Téléchargement des ressources',
            'Certificats de réussite',
            'Sessions vidéo en direct',
          ],
          paymentMethod: {
            brand: 'visa',
            last4: '4242',
            expiryMonth: 12,
            expiryYear: 2025
          }
        };
        
        setSubscription(mockSubscription);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'abonnement:', error);
        setError('Impossible de charger les informations d\'abonnement');
        setLoading(false);
      }
    };
    
    fetchSubscription();
  }, [user]);

  const handleCancelSubscription = async () => {
    if (!cancelReason) {
      setError('Veuillez indiquer une raison d\'annulation');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mettre à jour l'état local
      if (subscription) {
        setSubscription({
          ...subscription,
          cancelAtPeriodEnd: true
        });
      }
      
      setSuccessMessage('Votre abonnement sera annulé à la fin de la période de facturation actuelle');
      setShowCancelModal(false);
      setCancelReason('');
    } catch (error) {
      setError('Erreur lors de l\'annulation de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setLoading(true);
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mettre à jour l'état local
      if (subscription) {
        setSubscription({
          ...subscription,
          cancelAtPeriodEnd: false
        });
      }
      
      setSuccessMessage('Votre abonnement a été réactivé avec succès');
    } catch (error) {
      setError('Erreur lors de la réactivation de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentMethod = () => {
    setShowUpdatePaymentModal(true);
    // Dans une application réelle, cela ouvrirait un formulaire pour mettre à jour la méthode de paiement
    alert('Cette fonctionnalité vous permettrait de mettre à jour votre méthode de paiement.');
    setShowUpdatePaymentModal(false);
  };

  const handleDownloadInvoice = () => {
    // Simuler le téléchargement d'une facture
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = '📥 Téléchargement de la facture...';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
    
    alert('Facture téléchargée avec succès.');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRemainingDays = () => {
    if (!subscription) return 0;
    
    const endDate = new Date(subscription.currentPeriodEnd);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status: Subscription['status']) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Actif
        </span>;
      case 'canceled':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Annulé
        </span>;
      case 'past_due':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Paiement en retard
        </span>;
      case 'unpaid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Non payé
        </span>;
    }
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
            <CreditCard className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Restreint</h1>
          <p className="text-gray-600 mb-6">
            Les abonnements sont uniquement disponibles pour les apprenants. En tant que {user.role === 'instructor' ? 'formateur' : 'administrateur'}, vous n'avez pas accès à cette fonctionnalité.
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre abonnement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Abonnement</h1>
              <p className="text-gray-600">Gérez votre abonnement et vos informations de facturation</p>
            </div>
          </div>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {subscription ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Détails de l'abonnement */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Détails de l'Abonnement</h2>
                  {getStatusBadge(subscription.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <Award className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Plan</p>
                      <p className="font-medium text-gray-900">{subscription.planName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prix</p>
                      <p className="font-medium text-gray-900">
                        {(subscription.price / 100).toFixed(2)} € / {subscription.interval === 'month' ? 'mois' : 'an'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Période actuelle</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <RefreshCw className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Renouvellement</p>
                      <p className="font-medium text-gray-900">
                        {subscription.cancelAtPeriodEnd 
                          ? 'Ne se renouvellera pas' 
                          : `Se renouvelle dans ${getRemainingDays()} jours`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Méthode de paiement */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Méthode de Paiement</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <CreditCard className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}
                        </p>
                        <p className="text-sm text-gray-500">
                          Expire le {subscription.paymentMethod.expiryMonth}/{subscription.paymentMethod.expiryYear}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleUpdatePaymentMethod}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Mettre à jour
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex flex-wrap gap-4">
                    {subscription.cancelAtPeriodEnd ? (
                      <button
                        onClick={handleReactivateSubscription}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <RefreshCw className="h-5 w-5" />
                        <span>Réactiver l'Abonnement</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <span>Annuler l'Abonnement</span>
                      </button>
                    )}
                    
                    <button
                      onClick={handleDownloadInvoice}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                    >
                      <Download className="h-5 w-5" />
                      <span>Télécharger la Facture</span>
                    </button>
                    
                    <Link
                      to="/subscription-plans"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Changer de Plan</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Historique de facturation */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Historique de Facturation</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Facture
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(subscription.currentPeriodStart)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{(subscription.price / 100).toFixed(2)} €</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Payé
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={handleDownloadInvoice}
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(new Date(new Date(subscription.currentPeriodStart).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString())}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{(subscription.price / 100).toFixed(2)} €</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Payé
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={handleDownloadInvoice}
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Fonctionnalités du plan */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fonctionnalités Incluses</h3>
                <ul className="space-y-3">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Aide et support */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aide et Support</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => alert('Cette fonctionnalité vous permettrait de contacter le support client.')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <HelpCircle className="h-5 w-5 text-primary-600" />
                    <span className="font-medium text-gray-900">Contacter le Support</span>
                  </button>
                  <button
                    onClick={() => alert('Cette fonctionnalité vous permettrait de consulter la FAQ sur les abonnements.')}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <FileText className="h-5 w-5 text-secondary-600" />
                    <span className="font-medium text-gray-900">FAQ Abonnements</span>
                  </button>
                </div>
              </div>

              {/* Sécurité */}
              <div className="bg-gray-100 rounded-xl p-4 flex items-center space-x-3">
                <Shield className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Paiements Sécurisés</p>
                  <p className="text-xs text-gray-600">Toutes vos informations de paiement sont chiffrées et sécurisées.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun abonnement actif
            </h3>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas d'abonnement actif actuellement. Découvrez nos plans pour accéder à toutes les fonctionnalités premium.
            </p>
            <Link
              to="/subscription-plans"
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-block"
            >
              Voir les Plans d'Abonnement
            </Link>
          </div>
        )}
      </div>

      {/* Modal d'annulation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Annuler votre abonnement</h3>
            <p className="text-gray-700 mb-4">
              Nous sommes désolés de vous voir partir. Votre abonnement restera actif jusqu'à la fin de la période de facturation actuelle ({formatDate(subscription?.currentPeriodEnd || '')}).
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison de l'annulation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez une raison</option>
                <option value="Trop cher">Trop cher</option>
                <option value="Je n'utilise pas assez le service">Je n'utilise pas assez le service</option>
                <option value="Je passe à un autre plan">Je passe à un autre plan</option>
                <option value="Fonctionnalités manquantes">Fonctionnalités manquantes</option>
                <option value="Problèmes techniques">Problèmes techniques</option>
                <option value="Autre raison">Autre raison</option>
              </select>
            </div>
            {cancelReason === 'Autre raison' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Précisez
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="Veuillez préciser la raison de votre annulation..."
                  required
                />
              </div>
            )}
            <div className="flex items-center space-x-3 justify-end">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={!cancelReason}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer l'Annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSubscription;