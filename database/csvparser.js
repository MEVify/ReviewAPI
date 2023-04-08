/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const pgPromise = require('pg-promise')();
const path = require('path');

const db = pgPromise({
  user: 'mevcaus',
  host: 'localhost',
  database: 'reviewsTest',
  password: 'LakeCascade13',
  port: 5432,
});

const characteristicsFilePath = path.resolve(__dirname, './csvfiles/characteristics.csv');
const reviewsFilePath = path.resolve(__dirname, './csvfiles/reviews.csv');
const characteristicsReviewsFilePath = path.resolve(__dirname, './csvfiles/characteristic_reviews.csv');
const reviewsPhotosFilePath = path.resolve(__dirname, './csvfiles/reviews_photos.csv');

const start = Date.now();
db.none(`COPY characteristics(id, product_id, name) FROM '${characteristicsFilePath}' DELIMITER ',' CSV HEADER;`)
  .then(() => db.none(`COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '${reviewsFilePath}' DELIMITER ',' CSV HEADER;`))
  .then(() => db.none(`COPY characteristics_reviews(id, characteristic_id, review_id, value) FROM '${characteristicsReviewsFilePath}' DELIMITER ',' CSV HEADER;`))
  .then(() => db.none(`COPY reviews_photos(id, review_id, url) FROM '${reviewsPhotosFilePath}' DELIMITER ',' CSV HEADER;`))
  .then(() => {
    console.log('process complete', `${Date.now() - start} ms taken`);
    pgPromise.end();
  })
  .catch((error) => console.error(error));
