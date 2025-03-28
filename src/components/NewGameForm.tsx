import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewGameFormProps {
  onCancel: () => void;
}

export default function NewGameForm({ onCancel }: NewGameFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('timeline');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/versions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameType: type,
          name,
          data: {
            events: []
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du jeu');
      }

      const data = await response.json();
      router.push(`/games/${type}/${data.versionId}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Type de jeu
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="timeline">Timeline</option>
          <option value="quiz">Quiz</option>
          <option value="flashcards">Flashcards</option>
        </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom du jeu
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Entrez le nom du jeu"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Décrivez le jeu"
        />
      </div>

      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="game-button game-button-secondary"
          disabled={isLoading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="game-button game-button-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Création...' : 'Créer le jeu'}
        </button>
      </div>
    </form>
  );
} 