import db from '../database/connection.js'

export function leaderboardBannerSocket (io) {
  setInterval(() => {
    const data = getLeaderboardBannerInformation()
    io.emit('server-sends-leaderboard-banner', { data })
  }, 1000)
}

export function getLeaderboardBannerInformation () {
  const rows = db
    .prepare(
            `
        SELECT g.id, g.name, u.username, MAX(s.score) AS score
        FROM games g
        LEFT JOIN scores s ON s.game_id = g.id
        LEFT JOIN users u ON s.user_id = u.id
        GROUP BY g.id, g.name, s.user_id
        ORDER BY g.id, score DESC
    `
    )
    .all()

  const gamesById = rows.reduce((games, row) => {
    if (!games[row.id]) {
      games[row.id] = { name: row.name, scores: [] }
    }
    if (row.score !== null && games[row.id].scores.length < 3) {
      games[row.id].scores.push({
        username: row.username,
        score: row.score
      })
    }
    return games
  }, {})

  return Object.values(gamesById)
}
