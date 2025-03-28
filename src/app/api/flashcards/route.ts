import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const FLASHCARDS_FILE = path.join(process.cwd(), 'public/games/flashcards/data.json');

// Données par défaut
const defaultCards = [
  {
    id: '1',
    front: "Qu'est-ce que HTML ?",
    back: "HyperText Markup Language"
  },
  {
    id: '2',
    front: "Qu'est-ce que CSS ?",
    back: "Cascading Style Sheets"
  },
  {
    id: '3',
    front: "Qu'est-ce que JS ?",
    back: "JavaScript"
  },
  {
    id: '4',
    front: "Qu'est-ce que React ?",
    back: "Une bibliothèque JavaScript pour créer des interfaces utilisateur"
  },
  {
    id: '5',
    front: "Qu'est-ce que Next.js ?",
    back: "Un framework React pour la production"
  }
];

// Créer le fichier de données s'il n'existe pas
if (!fs.existsSync(FLASHCARDS_FILE)) {
  fs.writeFileSync(FLASHCARDS_FILE, JSON.stringify({ cards: defaultCards }, null, 2));
}

export async function GET() {
  try {
    const data = fs.readFileSync(FLASHCARDS_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Erreur lors de la lecture des cartes:', error);
    return NextResponse.json({ cards: defaultCards });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cards } = body;

    if (!cards) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    fs.writeFileSync(FLASHCARDS_FILE, JSON.stringify({ cards }, null, 2));
    return NextResponse.json({ message: 'Cartes sauvegardées avec succès' });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des cartes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des cartes' },
      { status: 500 }
    );
  }
} 