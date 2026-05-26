import "dotenv/config";
import db from "../connection.js";
import { hashPassword } from "../../utils/passwordHashing.js";
import { seedCountries, seedGames } from "../seed.js";
import { testUsers, testScores } from "./seedTest.js";

// Drop and recreate all tables
db.exec("DROP TABLE IF EXISTS scores");
db.exec("DROP TABLE IF EXISTS users");
db.exec("DROP TABLE IF EXISTS games");
db.exec("DROP TABLE IF EXISTS countries");

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
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    profile_picture TEXT DEFAULT '/default-avatar.svg',
    country_id INTEGER REFERENCES countries(id),
    birthday TEXT,
    weight REAL,
    gender INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

seedCountries(db);
seedGames(db);

const testPassword = await hashPassword("123");

const insertUser = db.prepare(
    "INSERT INTO users (username, email, password, name, country_id, birthday, weight, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
);
const insertScore = db.prepare(
    "INSERT INTO scores (user_id, game_id, score) VALUES (?, ?, ?)",
);

const games = db.prepare("SELECT id FROM games ORDER BY id").all();

for (const userData of testUsers) {
    const country = db
        .prepare("SELECT id FROM countries WHERE code = ?")
        .get(userData.countryCode);
    const { lastInsertRowid: userId } = insertUser.run(
        userData.username,
        userData.email,
        testPassword,
        userData.name,
        country?.id ?? null,
        userData.birthday,
        userData.weight,
        userData.gender,
    );

    const userIndex = testUsers.indexOf(userData);
    const userScores = testScores[userIndex];

    games.forEach((game, gameIndex) => {
        const scores = userScores[gameIndex] ?? [];
        scores.forEach((score) => insertScore.run(userId, game.id, score));
    });
}
