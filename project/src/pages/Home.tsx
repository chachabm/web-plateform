import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Users, Award, Star, BookOpen, Globe, Target } from 'lucide-react';
import CourseCard from '../components/Course/CourseCard';
import { mockCourses } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const featuredCourses = mockCourses.slice(0, 3);
  const popularCourses = mockCourses.filter(course => course.isPopular).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Maîtrisez les Langues
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  En Ligne
                </span>
              </h1>
              <p className="text-xl text-red-100 leading-relaxed">
                Rejoignez plus de 50 000 apprenants dans le monde et maîtrisez une nouvelle langue avec nos 
                cours en ligne complets, nos instructeurs experts et nos outils d'apprentissage interactifs.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {user ? (
                  <>
                    <Link
                      to="/courses"
                      className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Parcourir les Cours</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/dashboard"
                      className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>Mon Tableau de Bord</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Commencer Gratuitement</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                    <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors flex items-center justify-center space-x-2">
                      <Play className="h-5 w-5" />
                      <span>Voir la Démo</span>
                    </button>
                  </>
                )}
              </div>
              {!user && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-red-100 text-sm">
                    ✨ <strong>Entièrement Gratuit !</strong> Créez votre compte et commencez à apprendre immédiatement. 
                    Tous les cours et fonctionnalités sont disponibles sans frais.
                  </p>
                </div>
              )}
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">50K+</div>
                    <div className="text-sm text-red-100">Étudiants</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <BookOpen className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">200+</div>
                    <div className="text-sm text-red-100">Cours</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Globe className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">15</div>
                    <div className="text-sm text-red-100">Langues</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Award className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm text-red-100">Taux de Réussite</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir LearnMe ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre plateforme offre le moyen le plus efficace d'apprendre les langues en ligne 
              avec une technologie de pointe et des méthodologies éprouvées.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Play className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Leçons Vidéo Interactives
              </h3>
              <p className="text-gray-600">
                Apprenez avec du contenu vidéo de haute qualité mettant en vedette des locuteurs natifs, 
                des sous-titres et des exercices interactifs.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-secondary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Apprentissage Personnalisé
              </h3>
              <p className="text-gray-600">
                Les recommandations alimentées par l'IA s'adaptent à votre style et rythme d'apprentissage 
                pour une efficacité maximale.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-success-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Instructeurs Certifiés
              </h3>
              <p className="text-gray-600">
                Apprenez auprès d'instructeurs de langues expérimentés et certifiés qui sont 
                des locuteurs natifs avec des méthodes d'enseignement éprouvées.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Support Communautaire
              </h3>
              <p className="text-gray-600">
                Rejoignez des groupes d'étude, pratiquez avec vos pairs et obtenez du soutien de 
                notre communauté d'apprentissage dynamique.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Accès Hors Ligne
              </h3>
              <p className="text-gray-600">
                Téléchargez les leçons et le matériel de pratique pour un apprentissage hors ligne 
                à tout moment, n'importe où.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-pink-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Suivi des Progrès
              </h3>
              <p className="text-gray-600">
                Surveillez vos progrès avec des analyses détaillées, des réalisations 
                et des commentaires personnalisés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cours en Vedette
            </h2>
            <p className="text-xl text-gray-600">
              Commencez votre parcours d'apprentissage des langues avec nos cours les plus populaires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center mt-12">
            {user ? (
              <Link
                to="/courses"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
              >
                <span>Voir Tous les Cours</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
              >
                <span>S'inscrire pour Accéder aux Cours</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Rejoignez Notre Communauté Mondiale
            </h2>
            <p className="text-xl text-red-100">
              Des milliers d'apprenants font confiance à LearnMe pour leur parcours d'apprentissage des langues
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">50 000+</div>
              <div className="text-red-100">Apprenants Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">200+</div>
              <div className="text-red-100">Cours d'Experts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">15</div>
              <div className="text-red-100">Langues Disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">4,9</div>
              <div className="text-red-100">Note Moyenne</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce Que Disent Nos Étudiants
            </h2>
            <p className="text-xl text-gray-600">
              Histoires réelles d'apprenants réels qui ont atteint leurs objectifs linguistiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "LearnMe a rendu l'apprentissage de l'espagnol tellement plus facile ! Les leçons interactives 
                et les commentaires personnalisés m'ont aidé à devenir conversationnel en seulement 3 mois."
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">Responsable Marketing</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Le cours de français a dépassé mes attentes. L'audio de locuteurs natifs 
                et les aperçus culturels ont rendu l'apprentissage engageant et pratique."
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                  alt="Michael Chen"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">Michael Chen</div>
                  <div className="text-sm text-gray-500">Ingénieur Logiciel</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "J'adore la flexibilité d'apprendre à mon propre rythme. Le mode hors ligne 
                est parfait pour mes trajets, et le suivi des progrès me maintient motivé."
              </p>
              <div className="flex items-center space-x-4">
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
                  alt="Emma Rodriguez"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">Emma Rodriguez</div>
                  <div className="text-sm text-gray-500">Enseignante</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-600 to-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Commencer Votre Parcours d'Apprentissage des Langues ?
          </h2>
          <p className="text-xl text-yellow-100 mb-8">
            Rejoignez des milliers d'apprenants qui réussissent et maîtrisez une nouvelle langue aujourd'hui. 
            Commencez à apprendre immédiatement avec notre plateforme entièrement gratuite.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            {user ? (
              <>
                <Link
                  to="/courses"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Parcourir les Cours
                </Link>
                <Link
                  to="/dashboard"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Aller au Tableau de Bord
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Commencer l'Apprentissage Gratuit
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Se Connecter
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;