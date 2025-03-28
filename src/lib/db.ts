import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Créer le dossier data s'il n'existe pas
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, 'games.db');

const db = new sqlite3.Database(dbPath);

// Promisify pour convertir les callbacks en promesses
const run = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const all = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Créer la table game_versions si elle n'existe pas
run(`
    CREATE TABLE IF NOT EXISTS game_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        game_type TEXT NOT NULL,
        name TEXT NOT NULL,
        data TEXT NOT NULL,
        width INTEGER DEFAULT 800,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

// Créer la table game_settings si elle n'existe pas
run(`
    CREATE TABLE IF NOT EXISTS game_settings (
        game_type TEXT PRIMARY KEY,
        default_version_id INTEGER,
        FOREIGN KEY (default_version_id) REFERENCES game_versions(id)
    )
`);

// Ajouter des données de test si la table est vide
get('SELECT COUNT(*) as count FROM game_versions').then((row: any) => {
  if (row.count === 0) {
    const timelines = [
      {
        name: "Histoire de l'Internet",
        width: 800,
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
        width: 800,
        events: [
          {
            id: "1",
            date: "1990",
            title: "WorldWideWeb",
            description: "Tim Berners-Lee crée le premier navigateur web, WorldWideWeb.",
            position: "left"
          },
          {
            id: "2",
            date: "1993",
            title: "Mosaic",
            description: "Mosaic devient le premier navigateur web populaire.",
            position: "right"
          },
          {
            id: "3",
            date: "1995",
            title: "Internet Explorer",
            description: "Microsoft lance Internet Explorer.",
            position: "left"
          },
          {
            id: "4",
            date: "2008",
            title: "Chrome",
            description: "Google lance Chrome, révolutionnant les navigateurs web.",
            position: "right"
          },
          {
            id: "5",
            date: "2015",
            title: "Edge",
            description: "Microsoft lance Edge pour remplacer Internet Explorer.",
            position: "left"
          }
        ]
      },
      {
        name: "Histoire des réseaux sociaux",
        width: 800,
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
      }
    ];

    timelines.forEach(timeline => {
      run(
        `INSERT INTO game_versions (game_type, name, data, width) VALUES (?, ?, ?, ?)`,
        ['timeline', timeline.name, JSON.stringify({ events: timeline.events }), timeline.width]
      );
    });
  }
});

export { run, all, get }; 