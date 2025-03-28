'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VersionManager from '@/components/VersionManager';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function QuizAdmin() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/quiz');
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Erreur lors du chargement des questions:', error);
      setMessage('Erreur lors du chargement des questions');
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleUpdateQuestion = (id: string, field: keyof QuizQuestion, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const handleAddOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: [...q.options, '']
        };
      }
      return q;
    }));
  };

  const handleRemoveOption = (questionId: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = q.options.filter((_, i) => i !== optionIndex);
        return {
          ...q,
          options: newOptions,
          correctAnswer: q.correctAnswer >= optionIndex ? Math.max(0, q.correctAnswer - 1) : q.correctAnswer
        };
      }
      return q;
    }));
  };

  const handleUpdateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions }),
      });

      if (response.ok) {
        setMessage('Questions sauvegardées avec succès !');
      } else {
        throw new Error('Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage('Erreur lors de la sauvegarde des questions');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVersionSelect = (version: any) => {
    setQuestions(version.data.questions);
    setMessage('Version chargée avec succès !');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Administration Quiz</h1>
            <button
              onClick={() => router.push('/games/quiz')}
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
            gameType="quiz"
            onVersionSelect={handleVersionSelect}
            currentData={{ questions }}
          />

          <div className="space-y-6">
            {questions.map((question) => (
              <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Question {questions.findIndex(q => q.id === question.id) + 1}</h3>
                  <button
                    onClick={() => handleRemoveQuestion(question.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question</label>
                    <textarea
                      value={question.question}
                      onChange={(e) => handleUpdateQuestion(question.id, 'question', e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    {question.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === index}
                          onChange={() => handleUpdateQuestion(question.id, 'correctAnswer', index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleUpdateOption(question.id, index, e.target.value)}
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleRemoveOption(question.id, index)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddOption(question.id)}
                      className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Ajouter une option
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between">
              <button
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Ajouter une question
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