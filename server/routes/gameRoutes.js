const express = require('express');
const router = express.Router();
const {
  getAllGames,
  getFeaturedGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
} = require('../controllers/gameController');

// 瀹氫箟娓告垙璺敱
router
  .route('/')
  .get(getAllGames)
  .post(createGame);

router.route('/featured').get(getFeaturedGames);

router
  .route('/:id')
  .get(getGameById)
  .put(updateGame)
  .delete(deleteGame);

module.exports = router;
