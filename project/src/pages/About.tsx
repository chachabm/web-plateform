import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Award, 
  Globe, 
  Target, 
  Heart,
  Star,
  Play,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react';

const About: React.FC = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const stats = [
    { icon: Users, label: 'Apprenants Actifs', value: '50 000+', color: 'text-primary-600' },
    { icon: BookOpen, label: 'Cours Experts', value: '200+', color: 'text-secondary-600' },
    { icon: Globe, label: 'Langues', value: '15', color: 'text-success-600' },
    { icon: Award, label: 'Certificats Délivrés', value: '25 000+', color: 'text-orange-600' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'Nous visons la plus haute qualité dans tout ce que nous faisons, du contenu des cours à l\'expérience utilisateur.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Nous sommes passionnés par les langues et croyons au pouvoir de la communication pour connecter les cultures.'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Nous favorisons une communauté d\'apprentissage solidaire où chacun peut grandir et réussir ensemble.'
    },
    {
      icon: Globe,
      title: 'Accessibilité',
      description: 'Nous rendons l\'apprentissage des langues accessible à tous, indépendamment du contexte ou de la localisation.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'PDG & Fondatrice',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Ancienne professeure de langues avec plus de 15 ans d\'expérience dans les technologies éducatives.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Michael Chen',
      role: 'Directeur Technique',
      image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Innovateur technologique passionné par la création de plateformes d\'apprentissage évolutives.',
      social: { linkedin: '#', github: '#' }
    },
    {
      name: 'Maria Rodriguez',
      role: 'Responsable du Contenu',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Polyglotte et conceptrice de programmes avec une expertise dans 8 langues.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'David Kim',
      role: 'Responsable du Design',
      image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      bio: 'Designer UX concentré sur la création d\'expériences d\'apprentissage intuitives et engageantes.',
      social: { linkedin: '#', twitter: '#' }
    }
  ];

  const testimonials = [
    {
      name: 'Emma Wilson',
      role: 'Responsable Marketing',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'LearnMe a transformé ma carrière. Apprendre l\'espagnol m\'a ouvert de nouvelles opportunités et m\'a aidé à communiquer avec des clients du monde entier.',
      rating: 5
    },
    {
      name: 'James Thompson',
      role: 'Développeur Logiciel',
      image: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'Les leçons interactives et le soutien communautaire ont rendu l\'apprentissage du japonais agréable et efficace. Hautement recommandé !',
      rating: 5
    },
    {
      name: 'Lisa Chen',
      role: 'Enseignante',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      quote: 'En tant qu\'instructrice sur LearnMe, j\'adore comment la plateforme m\'aide à atteindre des étudiants du monde entier et à suivre leurs progrès.',
      rating: 5
    }
  ];

  const milestones = [
    { year: '2020', event: 'Fondation de LearnMe avec la vision de démocratiser l\'apprentissage des langues' },
    { year: '2021', event: 'Lancement avec 5 langues et 1 000 étudiants' },
    { year: '2022', event: 'Atteinte de 10 000 apprenants actifs et expansion à 10 langues' },
    { year: '2023', event: 'Introduction des sessions vidéo en direct et des fonctionnalités communautaires' },
    { year: '2024', event: 'Plus de 50 000 apprenants et 15 langues disponibles' },
    { year: '2025', event: 'Expansion mondiale avec personnalisation alimentée par l\'IA' }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    alert(`📧 Merci pour votre message !\n\nNous avons reçu votre demande et vous répondrons dans les 24 heures.\n\nDétails du message :\n- Nom : ${data.name}\n- Email : ${data.email}\n- Sujet : ${data.subject}`);
    (e.target as HTMLFormElement).reset();
  };

  const handleVideoPlay = () => {
    setShowVideo(true);
    alert('🎬 Lecture de la vidéo de présentation...\n\nCeci ouvrirait notre vidéo de présentation montrant notre mission, notre équipe et notre impact sur l\'apprentissage des langues dans le monde entier.');
  };

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-red-600 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              À Propos de <span className="text-yellow-300">LearnMe</span>
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
              Permettre à des millions d'apprenants du monde entier de maîtriser de nouvelles langues et de connecter les cultures
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleVideoPlay}
                className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 backdrop-blur-sm"
              >
                <Play className="h-5 w-5" />
                <span>Voir Notre Histoire</span>
              </button>
              <Link
                to="/register"
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>Rejoindre Notre Communauté</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Chez LearnMe, nous croyons que la langue est le pont qui relie les cultures, ouvre les esprits 
                et crée des opportunités. Notre mission est de rendre l'éducation linguistique de haute qualité 
                accessible à tous, partout.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Nous combinons une technologie de pointe avec des méthodes pédagogiques éprouvées pour créer 
                une expérience d'apprentissage engageante, efficace et personnalisée qui s'adapte aux besoins 
                et aux objectifs uniques de chaque apprenant.
              </p>
              <div className="space-y-4">
                {[
                  'Démocratiser l\'accès à une éducation linguistique de qualité',
                  'Favoriser la communication et la compréhension mondiale',
                  'Permettre aux apprenants d\'atteindre leurs objectifs personnels et professionnels',
                  'Construire des ponts entre les cultures par la langue'
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-success-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2"
                alt="Étudiants apprenant ensemble"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ces valeurs fondamentales guident tout ce que nous faisons et façonnent l'expérience LearnMe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-r from-primary-100 to-secondary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:from-primary-200 group-hover:to-secondary-200">
                  <value.icon className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Parcours
            </h2>
            <p className="text-xl text-gray-600">
              D'une petite startup à une plateforme mondiale d'apprentissage des langues
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary-600 to-secondary-600 rounded-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-2xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                      <p className="text-gray-700">{milestone.event}</p>
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="w-6 h-6 bg-white border-4 border-primary-600 rounded-full"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rencontrez Notre Équipe
            </h2>
            <p className="text-xl text-gray-600">
              Des éducateurs et technologues passionnés travaillant à transformer l'apprentissage des langues
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full object-cover mx-auto shadow-lg group-hover:shadow-xl transition-shadow"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  {member.social.linkedin && (
                    <button
                      onClick={() => alert(`Ouverture du profil LinkedIn de ${member.name}...`)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </button>
                  )}
                  {member.social.twitter && (
                    <button
                      onClick={() => alert(`Ouverture du profil Twitter de ${member.name}...`)}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </button>
                  )}
                  {member.social.github && (
                    <button
                      onClick={() => alert(`Ouverture du profil GitHub de ${member.name}...`)}
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce Que Dit Notre Communauté
            </h2>
            <p className="text-xl text-gray-600">
              Des histoires réelles d'apprenants qui ont atteint leurs objectifs linguistiques
            </p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center">
                <img
                  src={testimonials[activeTestimonial].image}
                  alt={testimonials[activeTestimonial].name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-6"
                />
                
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 italic">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                
                <div className="text-lg font-semibold text-gray-900">
                  {testimonials[activeTestimonial].name}
                </div>
                <div className="text-primary-600">
                  {testimonials[activeTestimonial].role}
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={prevTestimonial}
                className="bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-colors"
              >
                <ArrowRight className="h-5 w-5 text-gray-600 transform rotate-180" />
              </button>
              <button
                onClick={nextTestimonial}
                className="bg-white hover:bg-gray-50 p-3 rounded-full shadow-lg transition-colors"
              >
                <ArrowRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Contactez-Nous
            </h2>
            <p className="text-xl text-gray-600">
              Vous avez des questions ? Nous aimerions avoir de vos nouvelles. Envoyez-nous un message et nous vous répondrons dès que possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Envoyez-nous un message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="general">Demande Générale</option>
                    <option value="support">Support Technique</option>
                    <option value="partnership">Opportunité de Partenariat</option>
                    <option value="feedback">Commentaires</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Dites-nous comment nous pouvons vous aider..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail className="h-5 w-5" />
                  <span>Envoyer le Message</span>
                </button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Informations de Contact</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-lg">
                      <Mail className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <p className="text-gray-600">bonjour@learnme.com</p>
                      <p className="text-gray-600">support@learnme.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-secondary-100 p-3 rounded-lg">
                      <Phone className="h-6 w-6 text-secondary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Téléphone</h4>
                      <p className="text-gray-600">+33 (0)1 23 45 67 89</p>
                      <p className="text-gray-600">+33 (0)6 12 34 56 78</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-success-100 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-success-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Adresse</h4>
                      <p className="text-gray-600">123 Rue de l'Apprentissage</p>
                      <p className="text-gray-600">75001 Paris, France</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Heures d'Ouverture</h4>
                <div className="space-y-2 text-gray-600">
                  <p>Lundi - Vendredi : 9h00 - 18h00</p>
                  <p>Samedi : 10h00 - 16h00</p>
                  <p>Dimanche : Fermé</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Suivez-Nous</h4>
                <div className="flex space-x-4">
                  <button
                    onClick={() => alert('Ouverture de Twitter...')}
                    className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg transition-colors"
                  >
                    <Twitter className="h-6 w-6 text-blue-600" />
                  </button>
                  <button
                    onClick={() => alert('Ouverture de LinkedIn...')}
                    className="bg-blue-100 hover:bg-blue-200 p-3 rounded-lg transition-colors"
                  >
                    <Linkedin className="h-6 w-6 text-blue-600" />
                  </button>
                  <button
                    onClick={() => alert('Ouverture de GitHub...')}
                    className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors"
                  >
                    <Github className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à Commencer Votre Parcours Linguistique ?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Rejoignez des milliers d'apprenants qui ont déjà transformé leur vie grâce à l'apprentissage des langues avec LearnMe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>Commencer à Apprendre</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/courses"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center space-x-2"
            >
              <BookOpen className="h-5 w-5" />
              <span>Explorer les Cours</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;