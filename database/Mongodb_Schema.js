const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review_id: Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: Date,
  reviewer_name: String,
  helpfulness: Number,
  photos: [{
    id: Number,
    url: String,
  }],
});

const characteristicSchema = new mongoose.Schema({
  name: String,
  value: String,
});

const productSchema = new mongoose.Schema({
  product_id: String,
  ratings: [{
    rating: Number,
    count: Number,
  }],
  recommended: [{
    recommended: Boolean,
    count: Number,
  }],
  characteristics: [characteristicSchema],
  reviews: [reviewSchema],
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
