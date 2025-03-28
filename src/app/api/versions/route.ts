import { NextResponse } from 'next/server';
import { all, run } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gameType = searchParams.get('gameType');
  const timelineId = searchParams.get('timelineId');

  try {
    console.log('Paramètres reçus:', { gameType, timelineId });

    // Vérifier si la colonne timeline_id existe
    const columns = await all('PRAGMA table_info(game_versions)');
    const hasTimelineId = columns.some((col: any) => col.name === 'timeline_id');

    let query = 'SELECT * FROM game_versions WHERE game_type = ?';
    let params = [gameType];

    if (hasTimelineId && timelineId) {
      query += ' AND timeline_id = ?';
      params.push(parseInt(timelineId));
    }

    query += ' ORDER BY created_at DESC';

    console.log('Requête SQL:', query);
    console.log('Paramètres:', params);

    const versions = await all(query, params);
    console.log('Versions trouvées:', versions);

    // Vérifier si versions est un tableau
    if (!Array.isArray(versions)) {
      console.log('Versions n\'est pas un tableau:', versions);
      return NextResponse.json({ versions: [] });
    }

    // Parser les données JSON pour chaque version
    const parsedVersions = versions.map((version: any) => {
      try {
        return {
          ...version,
          data: typeof version.data === 'string' ? JSON.parse(version.data) : version.data
        };
      } catch (e) {
        console.error('Erreur lors du parsing des données de la version:', e);
        return {
          ...version,
          data: { events: [] }
        };
      }
    });

    console.log('Versions parsées:', parsedVersions);
    return NextResponse.json({ versions: parsedVersions });
  } catch (error) {
    console.error('Erreur détaillée lors de la récupération des versions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des versions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { gameType, name, data, timelineId } = await request.json();
    console.log('Données reçues pour la création:', { gameType, name, timelineId });

    if (!gameType || !name || !data) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    // Vérifier si la colonne timeline_id existe
    const columns = await all('PRAGMA table_info(game_versions)');
    const hasTimelineId = columns.some((col: any) => col.name === 'timeline_id');

    let query = 'INSERT INTO game_versions (game_type, name, data';
    let params = [gameType, name, JSON.stringify(data)];

    if (hasTimelineId) {
      query += ', timeline_id) VALUES (?, ?, ?, ?)';
      params.push(timelineId ? parseInt(timelineId) : null);
    } else {
      query += ') VALUES (?, ?, ?)';
    }

    const result = await run(query, params);
    console.log('Résultat de l\'insertion:', result);

    return NextResponse.json({
      message: 'Version créée avec succès',
      versionId: result.lastID
    });
  } catch (error) {
    console.error('Erreur détaillée lors de la création de la version:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la version' },
      { status: 500 }
    );
  }
} 