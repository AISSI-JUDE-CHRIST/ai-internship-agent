import Link from 'next/link';
import { 
  Search, 
  FileText, 
  Send, 
  Zap, 
  Shield, 
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header / Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                AI Job Agent
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="bg-primary-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                Inscription
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Postulez automatiquement aux
            <span className="text-primary-600"> offres d'emploi</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Laissez l'IA rechercher, filtrer et postuler aux meilleures offres d'emploi 
            pour vous. Gagnez du temps et maximisez vos chances de décrocher l'emploi de vos rêves.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#how-it-works"
              className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir AI Job Agent ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Automatisez votre recherche d'emploi avec l'intelligence artificielle
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100">
              <div className="bg-primary-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Recherche intelligente
              </h3>
              <p className="text-gray-600">
                Recherche automatique sur LinkedIn, Indeed, Hello Work, Job Teaser, 
                Welcome to the Jungle et plus encore.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                CV personnalisé
              </h3>
              <p className="text-gray-600">
                Génération automatique de CV et lettres de motivation personnalisées 
                pour chaque candidature grâce à l'IA.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Send className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Candidature automatique
              </h3>
              <p className="text-gray-600">
                Soumission automatique de vos candidatures sur les plateformes 
                d'emploi. Suivez l'état de vos candidatures en temps réel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comment ça fonctionne ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En quelques étapes simples, automatisez votre recherche d'emploi
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Créez votre profil
              </h3>
              <p className="text-gray-600">
                Téléchargez votre CV et configurez vos préférences (secteur, localisation, salaire)
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Recherche automatique
              </h3>
              <p className="text-gray-600">
                Notre IA recherche et filtre les offres correspondant à vos critères sur toutes les plateformes
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personnalisation IA
              </h3>
              <p className="text-gray-600">
                L'IA génère des CV et lettres de motivation uniques pour chaque offre d'emploi
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Candidature automatique
              </h3>
              <p className="text-gray-600">
                Soumission automatique de vos candidatures. Suivez vos candidatures dans votre tableau de bord
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Maximisez vos chances de succès
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Notre système vous permet de postuler à beaucoup plus d'offres 
                tout en maintenant la qualité de vos candidatures.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">Gain de temps</span>
                    <p className="text-gray-600">Postulez à des dizaines d'offres en quelques minutes</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">Candidatures personnalisées</span>
                    <p className="text-gray-600">Chaque candidature est adaptée à l'offre d'emploi</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">Suivi complet</span>
                    <p className="text-gray-600">Suivez l'état de toutes vos candidatures en un seul endroit</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-900">Multi-plateformes</span>
                    <p className="text-gray-600">Recherche sur LinkedIn, Indeed, Hello Work, Job Teaser, Welcome to the Jungle</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Statistiques</h3>
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Candidatures envoyées</span>
                      <span className="text-sm font-semibold text-gray-900">127</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Entretiens obtenus</span>
                      <span className="text-sm font-semibold text-gray-900">23</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Taux de réponse</span>
                      <span className="text-sm font-semibold text-gray-900">18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vos données sont sécurisées
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Nous utilisons un chiffrement de niveau bancaire pour protéger vos informations personnelles 
            et vos données de candidature.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à transformer votre recherche d'emploi ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers de candidats qui ont déjà automatisé leur recherche d'emploi
          </p>
          <Link
            href="/register"
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Commencer maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 text-primary-600" />
                <span className="ml-2 text-white font-bold">AI Job Agent</span>
              </div>
              <p className="text-sm">
                Automatisez votre recherche d'emploi avec l'intelligence artificielle.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="#how-it-works" className="hover:text-white">Fonctionnalités</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Tarifs</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">À propos</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Confidentialité</Link></li>
                <li><Link href="/terms" className="hover:text-white">Conditions</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 AI Job Agent. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
