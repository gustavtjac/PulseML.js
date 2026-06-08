import { Router } from 'express'
import db from '../database/connection.js'
import { isLoggedIn } from '../middleWare/authMiddleWare.js'

const router = Router()

router.get('/api/games', isLoggedIn, (req, res) => {
  const games = db.prepare('SELECT * FROM games').all()
  return res.status(200).send({ data: { games } })
})

router.get('/api/games/:id', isLoggedIn, (req, res) => {
  const { id } = req.params
  const game = db.prepare('SELECT * FROM games WHERE id = ?').get(id)

  if (!game) {
    return res
      .status(404)
      .send({ data: { errorMessage: 'Game not found' } })
  }

  return res.status(200).send({ data: { game } })
})

export default router
