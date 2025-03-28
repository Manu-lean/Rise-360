import { NextResponse } from 'next/server';
import { get, run } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const timeline = await get(`
      SELECT * FROM game_versions 
      WHERE id = ? AND game_type = 'timeline'
    `, [params.id]);

    if (!timeline) {
      return NextResponse.json(
        { error: 'Timeline non trouvée' },
        { status: 404 }
      );
    }

    // Parser les données JSON
    const parsedTimeline = {
      ...timeline,
      data: JSON.parse(timeline.data)
    };

    return NextResponse.json(parsedTimeline);
  } catch (error) {
    console.error('Erreur lors de la récupération de la timeline:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la timeline' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { events } = await request.json();
    
    if (!Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Les événements doivent être un tableau' },
        { status: 400 }
      );
    }

    // Récupérer la timeline existante
    const timeline = await get(`
      SELECT * FROM game_versions 
      WHERE id = ? AND game_type = 'timeline'
    `, [params.id]);

    if (!timeline) {
      return NextResponse.json(
        { error: 'Timeline non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour les événements
    const updatedData = {
      ...JSON.parse(timeline.data),
      events
    };

    await run(`
      UPDATE game_versions 
      SET data = ? 
      WHERE id = ? AND game_type = 'timeline'
    `, [JSON.stringify(updatedData), params.id]);

    return NextResponse.json({ message: 'Timeline mise à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la timeline:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la timeline' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await run(`
      DELETE FROM game_versions 
      WHERE id = ? AND game_type = 'timeline'
    `, [params.id]);

    return NextResponse.json({ message: 'Timeline supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la timeline:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la timeline' },
      { status: 500 }
    );
  }
} 