'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VersionManager from '@/components/VersionManager';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export default function FlashcardsAdmin() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const response = await fetch('/api/flashcards');
      const data = await response.json();
      setCards(data.cards);
    } catch (error) {
      console.error('Erreur lors du chargement des cartes:', error);
      setMessage('Erreur lors du chargement des cartes');
    }
  };

  const handleAddCard = () => {
    setCards([...cards, { id: Date.now().toString(), question: '', answer: '' }]);
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleUpdateCard = (id: string, field: keyof Flashcard, value: string) => {
    setCards(cards.map(card => 
      card.id === id ? { ...card, [field]: value } : card
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cards }),
      });

      if (response.ok) {
        setMessage('Cartes sauvegardées avec succès !');
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage('Erreur lors de la sauvegarde des cartes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVersionSelect = (version: any) => {
    setCards(version.data.cards);
    setMessage('Version chargée avec succès !');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Administration Flashcards</h1>
            <button
              onClick={() => router.push('/games/flashcards')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Voir le jeu
            </button>
          </div>

          {message && (
            <div className="mb-4 p-4 rounded bg-blue-100 text-blue-700">
              {message}
            </div>
          )}

          <VersionManager
            gameType="flashcards"
            onVersionSelect={handleVersionSelect}
            currentData={{ cards }}
          />

          <div className="space-y-6">
            {cards.map((card) => (
              <div key={card.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Carte {cards.findIndex(c => c.id === card.id) + 1}</h3>
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question</label>
                    <textarea
                      value={card.question}
                      onChange={(e) => handleUpdateCard(card.id, 'question', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Réponse</label>
                    <textarea
                      value={card.answer}
                      onChange={(e) => handleUpdateCard(card.id, 'answer', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button
                onClick={handleAddCard}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Ajouter une carte
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 