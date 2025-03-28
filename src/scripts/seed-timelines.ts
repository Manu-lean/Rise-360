import db from '@/lib/db';

const timelines = [
  {
    name: "Histoire de l'Internet",
    events: [
      {
        id: "1",
        date: "1969",
        title: "Création d'ARPANET",
        description: "Le premier réseau de communication entre ordinateurs est créé par le département de la défense américaine."
      },
      {
        id: "2",
        date: "1971",
        title: "Premier email",
        description: "Ray Tomlinson envoie le premier email et invente le symbole @ pour séparer le nom d'utilisateur du nom de domaine."
      },
      {
        id: "3",
        date: "1983",
        title: "TCP/IP",
        description: "Adoption du protocole TCP/IP comme standard pour ARPANET."
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
    events: [
      {
        id: "1",
        date: "2004",
        title: "Facebook",
        description: "Mark Zuckerberg lance Facebook à Harvard."
      },
      {
        id: "2",
        date: "2006",
        title: "Twitter",
        description: "Jack Dorsey crée Twitter, permettant de partager des messages courts."
      },
      {
        id: "3",
        date: "2010",
        title: "Instagram",
        description: "Kevin Systrom lance Instagram, une application de partage de photos."
      },
      {
        id: "4",
        date: "2016",
        title: "TikTok",
        description: "ByteDance lance TikTok, révolutionnant le partage de vidéos courtes."
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

async function seedTimelines() {
  try {
    // Supprimer les timelines existantes
    db.prepare('DELETE FROM game_versions WHERE game_type = ?').run('timeline');

    // Insérer les nouvelles timelines
    const stmt = db.prepare(`
      INSERT INTO game_versions (game_type, name, data)
      VALUES (?, ?, ?)
    `);

    timelines.forEach(timeline => {
      stmt.run('timeline', timeline.name, JSON.stringify({ events: timeline.events }));
    });

    console.log('Timelines de test ajoutées avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des timelines de test:', error);
  }
}

seedTimelines(); 