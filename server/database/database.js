import 'dotenv/config';
import { hashPassword } from '../utils/passwordHashing.js';
import { seedCountries, seedGames } from './seed.js';

import db from './connection.js';

const ADMIN_PASSWORD = await hashPassword(
    process.env.ADMIN_PASSWORD ?? 'admin',
);

const deleteMode = process.argv.includes('--delete');

if (deleteMode) {
    db.exec('DROP TABLE IF EXISTS scores');
    db.exec('DROP TABLE IF EXISTS users');
    db.exec('DROP TABLE IF EXISTS games');
    db.exec('DROP TABLE IF EXISTS countries');
}

db.exec(`
  CREATE TABLE IF NOT EXISTS countries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    code CHAR(2) NOT NULL UNIQUE
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE COLLATE NOCASE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    profile_picture TEXT DEFAULT '/default-avatar.svg',
    country_id INTEGER REFERENCES countries(id),
    birthday TEXT NOT NULL,
    weight REAL NOT NULL,
    gender INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    streak INTEGER DEFAULT 0,
    reset_token TEXT,
    reset_token_expires INTEGER
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    game_id INTEGER NOT NULL REFERENCES games(id),
    score INTEGER NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

if (deleteMode) {
    seedCountries(db);

    const denmark = db
        .prepare('SELECT id FROM countries WHERE code = ?')
        .get('DK');

    db.prepare(
        'INSERT INTO users (username, email, password, name, country_id, birthday, weight, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    ).run(
        'admin',
        'admin@test.dk',
        ADMIN_PASSWORD,
        'Admin',
        denmark.id,
        '1990-01-01',
        80,
        0,
    );

    seedGames(db);
}
