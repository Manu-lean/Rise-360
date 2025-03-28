'use client';

import Link from 'next/link';

export default function AdminPage() {
  const games = [
    {
      name: 'Timeline',
      description: 'Gérer les événements de la timeline',
      path: '/admin/timeline'
    },
    {
      name: 'Flashcards',
      description: 'Gérer les cartes mémoire',
      path: '/admin/flashcards'
    },
    {
      name: 'Jeu de Tri',
      description: 'Gérer les éléments à trier',
      path: '/admin/sorting'
    },
    {
      name: 'Quiz',
      description: 'Gérer les questions du quiz',
      path: '/admin/quiz'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Administration des Jeux</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game) => (
              <Link
                key={game.name}
                href={game.path}
                className="block p-6 bg-white border rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{game.name}</h2>
                <p className="text-gray-600">{game.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 