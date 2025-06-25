import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    if (email) {
      alert(`📧 Merci de vous être abonné à notre newsletter !\n\nNous avons ajouté ${email} à notre liste de diffusion. Vous recevrez des mises à jour sur les nouveaux cours, fonctionnalités et conseils d'apprentissage des langues.`);
      (e.target as HTMLFormElement).reset();
    }
  };

  const handleSocialClick = (platform: string) => {
    alert(`🔗 Ouverture de ${platform}...\n\nCeci vous redirigerait vers notre page ${platform} où vous pouvez nous suivre pour des mises à jour et du contenu d'apprentissage des langues.`);
  };

  const handleContactClick = (method: string, value: string) => {
    switch (method) {
      case 'email':
        window.location.href = `mailto:${value}`;
        break;
      case 'phone':
        window.location.href = `tel:${value}`;
        break;
      case 'address':
        alert(`📍 Notre Adresse :\n\n${value}\n\nCeci ouvrirait votre application de cartes pour montrer notre emplacement.`);
        break;
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Marque */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">LearnMe</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Maîtrisez les langues en ligne avec notre plateforme d'apprentissage complète. 
              Rejoignez des milliers d'apprenants dans le monde entier.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => handleSocialClick('Facebook')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleSocialClick('Twitter')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleSocialClick('Instagram')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleSocialClick('YouTube')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Langues Populaires */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Langues Populaires</h3>
            <ul className="space-y-2">
              <li><Link to="/courses?language=Espagnol" className="text-gray-400 hover:text-white transition-colors">Espagnol</Link></li>
              <li><Link to="/courses?language=Français" className="text-gray-400 hover:text-white transition-colors">Français</Link></li>
              <li><Link to="/courses?language=Allemand" className="text-gray-400 hover:text-white transition-colors">Allemand</Link></li>
              <li><Link to="/courses?language=Italien" className="text-gray-400 hover:text-white transition-colors">Italien</Link></li>
              <li><Link to="/courses?language=Japonais" className="text-gray-400 hover:text-white transition-colors">Japonais</Link></li>
              <li><Link to="/courses?language=Chinois" className="text-gray-400 hover:text-white transition-colors">Chinois</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><button onClick={() => alert('Ouverture du Centre d\'Aide...')} className="text-gray-400 hover:text-white transition-colors">Centre d'Aide</button></li>
              <li><button onClick={() => handleContactClick('email', 'support@learnme.com')} className="text-gray-400 hover:text-white transition-colors">Nous Contacter</button></li>
              <li><button onClick={() => alert('Ouverture de la FAQ...')} className="text-gray-400 hover:text-white transition-colors">FAQ</button></li>
              <li><button onClick={() => alert('Ouverture de la Communauté...')} className="text-gray-400 hover:text-white transition-colors">Communauté</button></li>
              <li><button onClick={() => alert('Ouverture du Blog...')} className="text-gray-400 hover:text-white transition-colors">Blog</button></li>
            </ul>
            
            {/* Infos de Contact */}
            <div className="mt-6 space-y-2">
              <button 
                onClick={() => handleContactClick('email', 'support@learnme.com')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>support@learnme.com</span>
              </button>
              <button 
                onClick={() => handleContactClick('phone', '+33-1-LEARN-ME')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+33-1-LEARN-ME</span>
              </button>
              <button 
                onClick={() => handleContactClick('address', '123 Rue de l\'Apprentissage, Paris, 75001')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <MapPin className="h-4 w-4" />
                <span>123 Rue de l'Apprentissage, Paris</span>
              </button>
            </div>
          </div>

          {/* Entreprise & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 mb-6">
              <li><button onClick={() => alert('Ouverture de À Propos...')} className="text-gray-400 hover:text-white transition-colors">À Propos</button></li>
              <li><button onClick={() => alert('Ouverture des Carrières...')} className="text-gray-400 hover:text-white transition-colors">Carrières</button></li>
              <li><button onClick={() => alert('Ouverture de la Presse...')} className="text-gray-400 hover:text-white transition-colors">Presse</button></li>
              <li><button onClick={() => alert('Ouverture de la Politique de Confidentialité...')} className="text-gray-400 hover:text-white transition-colors">Politique de Confidentialité</button></li>
              <li><button onClick={() => alert('Ouverture des Conditions de Service...')} className="text-gray-400 hover:text-white transition-colors">Conditions de Service</button></li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold mb-2">Restez Informé</h4>
              <p className="text-gray-400 text-sm mb-3">Recevez les derniers conseils d'apprentissage des langues et mises à jour de cours.</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Entrez votre email"
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  S'abonner
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 LearnMe. Tous droits réservés.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-6">
            <button 
              onClick={() => alert('Ouverture de la Politique de Confidentialité...')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Confidentialité
            </button>
            <button 
              onClick={() => alert('Ouverture des Conditions...')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Conditions
            </button>
            <button 
              onClick={() => alert('Ouverture de la Politique des Cookies...')}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cookies
            </button>
            <p className="text-gray-400 text-sm">
              Fait avec ❤️ pour les apprenants de langues du monde entier
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;