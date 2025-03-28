'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VersionManager from '@/components/VersionManager';

interface SortingItem {
  id: string;
  text: string;
  category: string;
}

export default function SortingAdmin() {
  const [items, setItems] = useState<SortingItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch('/api/sorting');
      const data = await response.json();
      setItems(data.items);
      // Extraire les catégories uniques
      const uniqueCategories = [...new Set(data.items.map((item: SortingItem) => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erreur lors du chargement des éléments:', error);
      setMessage('Erreur lors du chargement des éléments');
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), text: '', category: categories[0] || '' }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof SortingItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddCategory = () => {
    const newCategory = prompt('Nouvelle catégorie:');
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/sorting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (response.ok) {
        setMessage('Éléments sauvegardés avec succès !');
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage('Erreur lors de la sauvegarde des éléments');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVersionSelect = (version: any) => {
    setItems(version.data.items);
    // Mettre à jour les catégories
    const uniqueCategories = [...new Set(version.data.items.map((item: SortingItem) => item.category))];
    setCategories(uniqueCategories);
    setMessage('Version chargée avec succès !');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Administration Jeu de Tri</h1>
            <button
              onClick={() => router.push('/games/sorting')}
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
            gameType="sorting"
            onVersionSelect={handleVersionSelect}
            currentData={{ items }}
          />

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Catégories</h2>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Ajouter une catégorie
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <span
                  key={category}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Élément {items.findIndex(i => i.id === item.id) + 1}</h3>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Texte</label>
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => handleUpdateItem(item.id, 'text', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                    <select
                      value={item.category}
                      onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Ajouter un élément
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