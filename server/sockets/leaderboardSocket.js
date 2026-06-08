import db from '../database/connection.js';

export function getAllLeaderboards() {
    const games = db.prepare('SELECT id FROM games').all();
    const result = {};
    for (const game of games) {
        result[game.id] = { highscores: getLeaderboardForGame(game.id) };
    }
    return result;
}

export function getLeaderboardForGame(gameId) {
    return db
        .prepare(
            `
        SELECT s.score, s.date, u.username, u.profile_picture, c.code AS country_code, c.name AS country_name
        FROM scores s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN countries c ON u.country_id = c.id
        WHERE s.game_id = ?
          AND s.score = (
            SELECT MAX(s2.score) FROM scores s2
            WHERE s2.user_id = s.user_id AND s2.game_id = s.game_id
          )
        GROUP BY s.user_id
        ORDER BY s.score DESC
        LIMIT 50
    `,
        )
        .all(gameId);
}
