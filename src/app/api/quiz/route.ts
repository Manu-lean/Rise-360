import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'public/games/quiz/data.json');

// Fonction pour lire le fichier JSON
function readDataFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
    return { questions: [] };
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier:', error);
    return { questions: [] };
  }
}

// Fonction pour écrire dans le fichier JSON
function writeDataFile(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'écriture du fichier:', error);
    return false;
  }
}

export async function GET() {
  const data = readDataFile();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const success = writeDataFile(body);
    
    if (success) {
      return NextResponse.json({ message: 'Données sauvegardées avec succès' });
    } else {
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde des données' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête' },
      { status: 500 }
    );
  }
} 