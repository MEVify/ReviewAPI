const Router = require('express').Router();
const controllers = require('./controllers');

Router.get('/reviews/', controllers.getReviews);
Router.get('/reviews/meta', controllers.getMeta);
Router.post('/reviews', controllers.postReview);
Router.put('/reviews/:review_id/helpful', controllers.putHelpful);
Router.put('/reviews/:review_id/report', controllers.putReport);

module.exports = Router;