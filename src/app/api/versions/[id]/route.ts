import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const version = db.prepare('SELECT * FROM game_versions WHERE id = ?').get(params.id);
    
    if (!version) {
      return NextResponse.json(
        { error: 'Version non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...version,
      data: JSON.parse(version.data)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la version:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la version' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = db.prepare('DELETE FROM game_versions WHERE id = ?').run(params.id);
    
    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Version non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Version supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la version:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la version' },
      { status: 500 }
    );
  }
} 