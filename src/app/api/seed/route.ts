import { NextResponse } from 'next/server';
import { run } from '@/lib/db';

const timelines = [
  {
    name: "Histoire de l'Internet",
    description: "Explorez l'histoire d'Internet à travers les événements clés",
    events: [
      {
        id: "1",
        date: "1969",
        title: "Création d'ARPANET",
        description: "Le premier réseau de communication entre ordinateurs est créé par le département de la défense américaine.",
        position: "left"
      },
      {
        id: "2",
        date: "1971",
        title: "Premier email",
        description: "Ray Tomlinson envoie le premier email et invente le symbole @ pour séparer le nom d'utilisateur du nom de domaine.",
        position: "right"
      },
      {
        id: "3",
        date: "1983",
        title: "TCP/IP",
        description: "Adoption du protocole TCP/IP comme standard pour ARPANET.",
        position: "left"
      }
    ]
  },
  {
    name: "Évolution des navigateurs web",
    events: [
      {
        id: "1",
        date: "1990",
        title: "WorldWideWeb",
        description: "Tim Berners-Lee crée le premier navigateur web, WorldWideWeb."
      },
      {
        id: "2",
        date: "1993",
        title: "Mosaic",
        description: "Mosaic devient le premier navigateur web populaire."
      },
      {
        id: "3",
        date: "1995",
        title: "Internet Explorer",
        description: "Microsoft lance Internet Explorer."
      },
      {
        id: "4",
        date: "2008",
        title: "Chrome",
        description: "Google lance Chrome, révolutionnant les navigateurs web."
      },
      {
        id: "5",
        date: "2015",
        title: "Edge",
        description: "Microsoft lance Edge pour remplacer Internet Explorer."
      }
    ]
  },
  {
    name: "Histoire des réseaux sociaux",
    description: "Découvrez l'évolution des réseaux sociaux depuis leur création",
    events: [
      {
        id: "1",
        date: "2004",
        title: "Facebook",
        description: "Mark Zuckerberg lance Facebook à Harvard.",
        position: "left"
      },
      {
        id: "2",
        date: "2006",
        title: "Twitter",
        description: "Jack Dorsey crée Twitter, permettant de partager des messages courts.",
        position: "right"
      },
      {
        id: "3",
        date: "2010",
        title: "Instagram",
        description: "Kevin Systrom lance Instagram, une application de partage de photos.",
        position: "left"
      },
      {
        id: "4",
        date: "2016",
        title: "TikTok",
        description: "ByteDance lance TikTok, révolutionnant le partage de vidéos courtes.",
        position: "right"
      }
    ]
  },
  {
    name: "Évolution des langages web",
    events: [
      {
        id: "1",
        date: "1995",
        title: "JavaScript",
        description: "Brendan Eich crée JavaScript pour Netscape Navigator."
      },
      {
        id: "2",
        date: "1996",
        title: "CSS",
        description: "Première version de CSS pour le style des pages web."
      },
      {
        id: "3",
        date: "2015",
        title: "ES6",
        description: "Publication d'ECMAScript 6, apportant de nombreuses améliorations à JavaScript."
      }
    ]
  }
];

export async function GET() {
  try {
    // Supprimer les timelines existantes
    await run('DELETE FROM game_versions WHERE game_type = ?', ['timeline']);

    // Insérer les nouvelles timelines
    for (const timeline of timelines) {
      await run(
        `INSERT INTO game_versions (game_type, name, data) VALUES (?, ?, ?)`,
        ['timeline', timeline.name, JSON.stringify({ events: timeline.events })]
      );
    }

    return NextResponse.json({ message: 'Timelines de test ajoutées avec succès !' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout des timelines de test:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout des timelines de test' },
      { status: 500 }
    );
  }
} 