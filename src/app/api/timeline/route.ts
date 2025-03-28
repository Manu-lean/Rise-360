import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { all } from '@/lib/db';

const DATA_FILE = path.join(process.cwd(), 'public/games/timeline/data.json');

// Fonction pour s'assurer que le fichier de données existe
const ensureDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
      events: [
        {
          id: '1',
          date: '1989',
          title: 'Création du World Wide Web',
          description: 'Tim Berners-Lee propose le concept du World Wide Web au CERN.'
        },
        {
          id: '2',
          date: '1993',
          title: 'Premier navigateur web',
          description: 'Mosaic, le premier navigateur web populaire, est lancé.'
        },
        {
          id: '3',
          date: '1995',
          title: 'JavaScript',
          description: 'Brendan Eich crée JavaScript pour Netscape Navigator.'
        },
        {
          id: '4',
          date: '2004',
          title: 'Web 2.0',
          description: 'Tim O\'Reilly popularise le terme "Web 2.0" pour décrire l\'évolution du web.'
        },
        {
          id: '5',
          date: '2008',
          title: 'Premier navigateur Chrome',
          description: 'Google lance Chrome, révolutionnant les navigateurs web.'
        }
      ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
};

export async function GET() {
  try {
    const timelines = await all(`
      SELECT * FROM game_versions 
      WHERE game_type = 'timeline' 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ timelines });
  } catch (error) {
    console.error('Erreur lors de la récupération des timelines:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des timelines' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: 'Données sauvegardées avec succès' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des données' },
      { status: 500 }
    );
  }
} 