import { NextResponse } from 'next/server';
import { all } from '@/lib/db';

export async function GET() {
  try {
    // Récupérer toutes les versions de jeux
    const query = `
      SELECT DISTINCT 
        id,
        game_type as type,
        name,
        data,
        created_at
      FROM game_versions
      ORDER BY created_at DESC
    `;

    const games = await all(query);

    // Parser les données JSON pour chaque jeu
    const parsedGames = games.map((game: any) => {
      try {
        return {
          ...game,
          data: typeof game.data === 'string' ? JSON.parse(game.data) : game.data
        };
      } catch (e) {
        console.error('Erreur lors du parsing des données du jeu:', e);
        return {
          ...game,
          data: { events: [] }
        };
      }
    });

    return NextResponse.json({ games: parsedGames });
  } catch (error) {
    console.error('Erreur lors de la récupération des jeux:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des jeux' },
      { status: 500 }
    );
  }
} 