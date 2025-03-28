'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <h1>Rise 360 Games</h1>
          <nav className="header-nav">
            <Link href="/">Accueil</Link>
            <Link href="/games">Jeux</Link>
            <Link href="/about">À propos</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mini-jeux Interactifs pour Rise 360
          </h1>
          <p className="text-lg text-gray-600">
            Créez et intégrez facilement des jeux interactifs dans vos cours Rise 360
          </p>
        </div>

        <div className="game-grid">
          <div className="game-card">
            <img src="/games/flashcards/preview.jpg" alt="Flashcards" />
            <div className="game-card-content">
              <h2>Flashcards</h2>
              <p>Créez et utilisez des cartes mémoire interactives pour apprendre et réviser.</p>
              <div className="tags">
                <span className="tag">Mémorisation</span>
                <span className="tag">Révison</span>
              </div>
              <div className="game-card-actions">
                <Link href="/games/flashcards" className="button button-primary">
                  Jouer
                </Link>
                <Link href="/admin/flashcards" className="button button-secondary">
                  Éditer
                </Link>
              </div>
            </div>
          </div>

          <div className="game-card">
            <img src="/games/sorting/preview.jpg" alt="Jeu de Tri" />
            <div className="game-card-content">
              <h2>Jeu de Tri</h2>
              <p>Classez et organisez des éléments dans les bonnes catégories.</p>
              <div className="tags">
                <span className="tag">Catégorisation</span>
                <span className="tag">Organisation</span>
              </div>
              <div className="game-card-actions">
                <Link href="/games/sorting" className="button button-primary">
                  Jouer
                </Link>
                <Link href="/admin/sorting" className="button button-secondary">
                  Éditer
                </Link>
              </div>
            </div>
          </div>

          <div className="game-card">
            <img src="/games/quiz/preview.jpg" alt="Quiz Final" />
            <div className="game-card-content">
              <h2>Quiz Final</h2>
              <p>Testez vos connaissances avec des questions à choix multiples.</p>
              <div className="tags">
                <span className="tag">Évaluation</span>
                <span className="tag">Test</span>
              </div>
              <div className="game-card-actions">
                <Link href="/games/quiz" className="button button-primary">
                  Jouer
                </Link>
                <Link href="/admin/quiz" className="button button-secondary">
                  Éditer
                </Link>
              </div>
            </div>
          </div>

          <div className="game-card">
            <img src="/games/timeline/preview.jpg" alt="Timeline" />
            <div className="game-card-content">
              <h2>Timeline</h2>
              <p>Explorez l'histoire du web à travers une timeline interactive.</p>
              <div className="tags">
                <span className="tag">Histoire</span>
                <span className="tag">Chronologie</span>
              </div>
              <div className="game-card-actions">
                <Link href="/games/timeline" className="button button-primary">
                  Voir
                </Link>
                <Link href="/admin/timeline" className="button button-secondary">
                  Éditer
                </Link>
              </div>
            </div>
          </div>

          <div className="game-card">
            <img src="/games/dialog-cards/preview.jpg" alt="Dialog Cards" />
            <div className="game-card-content">
              <h2>Dialog Cards</h2>
              <p>Créez des dialogues interactifs avec des cartes pour l'apprentissage des langues.</p>
              <div className="tags">
                <span className="tag">Langues</span>
                <span className="tag">Dialogue</span>
              </div>
              <div className="game-card-actions">
                <Link href="/games/dialog-cards" className="button button-primary">
                  Jouer
                </Link>
                <Link href="/admin/dialog-cards" className="button button-secondary">
                  Éditer
                </Link>
              </div>
            </div>
          </div>

          <div className="game-card">
            <img src="/games/image-hotspots/preview.jpg" alt="Image Hotspots" />
            <div className="game-card-content">
              <h2>Image Hotspots</h2>
              <p>Ajoutez des points d'intérêt interactifs sur des images pour une exploration guidée.</p>
              <div className="tags">
                <span className="tag">Images</span>
                <span className="tag">Interactif</span>
              </div>
              <div className="game-card-actions">
                <Link href="/games/image-hotspots" className="button button-primary">
                  Jouer
                </Link>
                <Link href="/admin/image-hotspots" className="button button-secondary">
                  Éditer
                </Link>
              </div>
            </div>
          </div>

          <div className="game-card">
            <img src="/games/accordion/preview.jpg" alt="Accordion" />
            <div className="game-card-content">
              <h2>Accordion</h2>
              <p>Créez un accordéon interactif pour présenter du contenu de manière organisée.</p>
              <div className="tags">
                <span className="tag">Organisation</span>
                <span className="tag">Contenu</span>
              </div>
              <div className="game-card-actions">
                <Link href="/games/accordion" className="button button-primary">
                  Jouer
                </Link>
                <Link href="/admin/accordion" className="button button-secondary">
                  Éditer
                </Link>
              </div>
            </div>
          </div>

          <div className="game-card">
            <img src="/games/interactive-video/preview.jpg" alt="Interactive Video" />
            <div className="game-card-content">
              <h2>Interactive Video</h2>
              <p>Ajoutez des interactions et des quiz à vos vidéos pour un apprentissage actif.</p>
              <div className="tags">
                <span className="tag">Vidéo</span>
                <span className="tag">Interactif</span>
              </div>
              <div className="game-card-actions">
                <Link href="/games/interactive-video" className="button button-primary">
                  Jouer
                </Link>
                <Link href="/admin/interactive-video" className="button button-secondary">
                  Éditer
                </Link>
              </div>
            </div>
          </div>

          <div className="game-card">
            <img src="/games/course-presentation/preview.jpg" alt="Course Presentation" />
            <div className="game-card-content">
              <h2>Course Presentation</h2>
              <p>Créez une présentation interactive avec des quiz et des activités variées.</p>
              <div className="tags">
                <span className="tag">Présentation</span>
                <span className="tag">Quiz</span>
              </div>
              <div className="game-card-actions">
                <Link href="/games/course-presentation" className="button button-primary">
                  Jouer
                </Link>
                <Link href="/admin/course-presentation" className="button button-secondary">
                  Éditer
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="game-container">
          <h2 className="game-title">Comment intégrer les jeux dans Rise 360</h2>
          <p className="game-description">
            Pour intégrer un jeu dans votre cours Rise 360, suivez ces étapes :
          </p>
          <ol className="game-description" style={{ listStyleType: 'decimal', paddingLeft: '2rem' }}>
            <li>Cliquez sur le bouton "Jouer" du jeu que vous souhaitez intégrer</li>
            <li>Copiez l'URL de la page du jeu</li>
            <li>Dans Rise 360, ajoutez un bloc "Web Content"</li>
            <li>Collez l'URL du jeu dans le bloc</li>
            <li>Configurez les paramètres d'affichage selon vos besoins</li>
          </ol>
        </div>
      </main>
    </div>
  );
} 