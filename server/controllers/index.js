const db = require('../models')

module.exports = {
  getReviews: (req, res) => {
    const { page = 1, count = 5, sort = 'newest', product_id } = req.query;

    db.getReviewData(page, count, sort, product_id)
      .then(info => {
        info.results.forEach(review => {
          if(review.response === 'null') {
            review.response = null;
          }
          review.date = new Date(parseInt(review.date)).toISOString();
        })
        res.status(200).send(info);
      })
      .catch(err => {
        console.log('err fetching from controller\n', err);
      })
  },
  getMeta: (req, res) => {
    db.getMetaData(req.query.product_id)
      .then(info => {
        res.status(200).send(info.meta_data);
      })
      .catch(err => {
        console.log('err with getMeta\n', err)
      })
  },
  postReview: (req, res) => {
    const reviewData = [
      req.body.product_id,
      req.body.rating,
      req.body.summary,
      req.body.body,
      req.body.recommended,
      req.body.name,
      req.body.email,
    ]
    const { photos, characteristics } = req.body;
    db.addReview(reviewData, photos, characteristics)
      .then(() => {
        res.sendStatus(201);
      })
      .catch(err => {
        console.log('err adding review to server\n', err)
      })
  },
  putHelpful: (req, res) => {
    db.incrementReview(req.params.review_id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch(err => {
        console.log('err updating incrementing review\n', err)
      })
  },
  putReport: (req, res) => {
    db.reportReview(req.params.review_id)
      .then(() => {
        res.sendStatus(204);
      })
      .catch(err => {
        console.log('err reporting review\n', err)
      })
  },
};