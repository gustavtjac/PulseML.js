import "dotenv/config";
import db from "../connection.js";
import { hashPassword } from "../../utils/passwordHashing.js";
import { seedCountries, seedGames } from "../seed.js";
import { testUsers, testScores } from "./seedTest.js";

db.exec("DELETE FROM scores");
db.exec("DELETE FROM users");
db.exec("DELETE FROM games");
db.exec("DELETE FROM countries");

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

testUsers.forEach((userData, userIndex) => {
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

    games.forEach((game, gameIndex) => {
        const scores = testScores[userIndex]?.[gameIndex] ?? [];
        scores.forEach((score) => insertScore.run(userId, game.id, score));
    });
});
