import { Router } from 'express';
import db from '../database/connection.js';
import { isLoggedIn } from '../middleWare/authMiddleWare.js';
import { getLeaderboardBannerInformation } from '../sockets/leaderboardBannerSocket.js';
import { getLeaderboardForGame } from '../sockets/leaderboardSocket.js';

const router = Router();

router.get('/api/leaderboard-banner', (req, res) => {
    return res.status(200).send({ data: getLeaderboardBannerInformation() });
});

router.get('/api/leaderboard/:game_id', isLoggedIn, (req, res) => {
    const { game_id } = req.params;

    if (!game_id) {
        return res
            .status(400)
            .send({ data: { errorMessage: 'game_id is required' } });
    }

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(game_id);
    if (!game) {
        return res
            .status(404)
            .send({ data: { errorMessage: 'Game not found' } });
    }

    const highscores = getLeaderboardForGame(game_id);

    return res.status(200).send({ data: { highscores } });
});

router.get('/api/leaderboard/:game_id/:country_id', (req, res) => {
    const { game_id, country_id } = req.params;

    if (!game_id || !country_id) {
        return res.status(400).send({
            data: { errorMessage: 'game_id and country_id is required' },
        });
    }

    const game = db.prepare('SELECT * FROM games WHERE id = ?').get(game_id);
    if (!game) {
        return res.status(404).send({
            data: { errorMessage: 'Game_id is not valid, not found' },
        });
    }

    const highscores = db
        .prepare(
            'SELECT s.score, s.date, u.username, u.profile_picture, c.code AS country_code, c.name AS country_name FROM scores s JOIN users u ON s.user_id = u.id JOIN countries c ON u.country_id = c.id WHERE s.game_id = ? AND c.id = ? AND s.score = (SELECT MAX(s2.score) FROM scores s2 WHERE s2.user_id = s.user_id AND s2.game_id = s.game_id) GROUP BY s.user_id ORDER BY s.score DESC LIMIT 50',
        )
        .all(game_id, country_id);

    return res.status(200).send({ data: { highscores } });
});

router.get('/api/scores/user/:username', isLoggedIn, (req, res) => {
    const { username } = req.params;

    const user = db
        .prepare('SELECT id FROM users WHERE username = ?')
        .get(username);
    if (!user) {
        return res
            .status(404)
            .send({ data: { errorMessage: 'User not found' } });
    }

    const scores = db
        .prepare(
            'SELECT g.name AS game_name, MAX(s.score) AS best_score, COUNT(s.id) AS plays FROM scores s JOIN games g ON s.game_id = g.id WHERE s.user_id = ? GROUP BY s.game_id ORDER BY best_score DESC',
        )
        .all(user.id);

    return res.status(200).send({ data: { scores } });
});

router.post('/api/scores', isLoggedIn, (req, res) => {
    const { game_id, score } = req.body;

    if (!game_id || score === undefined) {
        return res
            .status(400)
            .send({ data: { errorMessage: 'game_id and score are required' } });
    }

    const game = db.prepare('SELECT id FROM games WHERE id = ?').get(game_id);
    if (!game) {
        return res
            .status(404)
            .send({ data: { errorMessage: 'Game not found' } });
    }

    const previousBest = db
        .prepare(
            'SELECT MAX(score) AS best FROM scores WHERE user_id = ? AND game_id = ?',
        )
        .get(req.session.user.id, game_id);

    const isPersonalBest =
        previousBest.best === null || score > previousBest.best;

    db.prepare(
        "INSERT INTO scores (user_id, game_id, score, date) VALUES (?, ?, ?, datetime('now'))",
    ).run(req.session.user.id, game_id, score);

    return res
        .status(201)
        .send({ data: { message: 'Score saved', isPersonalBest } });
});

export default router;
