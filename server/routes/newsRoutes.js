const express = require('express');
const router = express.Router();
const {
  getAllNews,
  getFeaturedNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');

// 瀹氫箟鏂伴椈璺敱
router
  .route('/')
  .get(getAllNews)
  .post(createNews);

router.route('/featured').get(getFeaturedNews);

router
  .route('/:id')
  .get(getNewsById)
  .put(updateNews)
  .delete(deleteNews);

module.exports = router;
