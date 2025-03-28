import { NextResponse } from 'next/server';
import { all, run } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameType = searchParams.get('gameType');

  try {
    let query = 'SELECT * FROM game_versions';
    let params = [];

    if (gameType) {
      query += ' WHERE game_type = ?';
      params.push(gameType);
    }

    query += ' ORDER BY created_at DESC';

    const versions = await all(query, params);

    return NextResponse.json({ versions });
  } catch (error) {
    console.error('Erreur lors de la récupération des versions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des versions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { gameType, name, data } = await request.json();

    if (!gameType || !name || !data) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    const result = await run(
      `INSERT INTO game_versions (game_type, name, data) VALUES (?, ?, ?)`,
      [gameType, name, JSON.stringify(data)]
    );

    return NextResponse.json({
      message: 'Version créée avec succès',
      versionId: result.lastID
    });
  } catch (error) {
    console.error('Erreur lors de la création de la version:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la version' },
      { status: 500 }
    );
  }
} 