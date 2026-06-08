import db from '../database/connection.js'

export function nextStreak (userId, previousLastPlayed) {
  if (!previousLastPlayed) {
    return 1
  }

  const { streak } = db
    .prepare('SELECT streak FROM users WHERE id = ?')
    .get(userId)

  const { dayDiffrence } = db
    .prepare(
      "SELECT CAST(julianday(DATE('now')) - julianday(DATE(?)) AS INTEGER) AS dayDiffrence"
    )
    .get(previousLastPlayed)

  if (dayDiffrence === 0) return streak
  if (dayDiffrence === 1) return streak + 1
  return 1
}

export function liveStreak (userId) {
  const user = db
    .prepare(
            `
        SELECT u.streak,
               (julianday('now') - julianday(MAX(s.date))) * 24 AS hoursSinceLastPlayed
        FROM users u
        LEFT JOIN scores s ON s.user_id = u.id
        WHERE u.id = ?
    `
    )
    .get(userId)

  if (user.hoursSinceLastPlayed === null || user.hoursSinceLastPlayed > 24) {
    return 0
  }

  return user.streak
}
