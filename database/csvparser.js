/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const pgPromise = require('pg-promise')();
const path = require('path');

const db = pgPromise({
  user: 'mevcaus',
  host: 'localhost',
  database: 'reviews',
  password: 'LakeCascade13',
  port: 5432,
});

const importCharacteristicsData = async () => {
  try {
    const filePath = path.resolve(__dirname, './csvfiles/characteristics.csv');
    await db.none(`COPY characteristics(id, product_id, name)
                    FROM '${filePath}'
                    DELIMITER ','
                    CSV HEADER;`);
    console.log('characteristics imported successfully');
  } catch (error) {
    console.log('error importing characteristics', error);
  }
};

const importReviewsData = async () => {
  try {
    const filePath = path.resolve(__dirname, './csvfiles/reviews.csv');

    await db.none(`COPY reviews(id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
                    FROM '${filePath}'
                    DELIMITER ','
                    CSV HEADER;`);

    console.log('reviews imported successfully');
  } catch (error) {
    console.log('error importing reviews', error);
  }
};

const importCharacteristicsReviews = async () => {
  try {
    const filePath = path.resolve(__dirname, './csvfiles/characteristic_reviews.csv');

    // Disable foreign key constraints
    await db.none('SET CONSTRAINTS ALL DEFERRED');

    await db.none(`COPY characteristics_reviews(id, characteristic_id, review_id, value)
                    FROM '${filePath}'
                    DELIMITER ','
                    CSV HEADER;`);

    // Enable foreign key constraints
    await db.none('SET CONSTRAINTS ALL IMMEDIATE');

    console.log('characteristic reviews imported successfully');
  } catch (error) {
    console.log('error importing characteristic reviews', error);
  }
};

const importReviewsPhotos = async () => {
  try {
    const filePath = path.resolve(__dirname, './csvfiles/reviews_photos.csv');

    // Disable foreign key constraints
    await db.none('SET CONSTRAINTS ALL DEFERRED');

    await db.none(`COPY reviews_photos(id, review_id, url)
                    FROM '${filePath}'
                    DELIMITER ','
                    CSV HEADER;`);

    // Enable foreign key constraints
    await db.none('SET CONSTRAINTS ALL IMMEDIATE');

    console.log('reviews photos imported successfully');
  } catch (error) {
    console.log('error importing characteristic reviews', error);
  }
};
// importCharacteristicsData();
// importReviewsData();
// importCharacteristicsReviews();
// importReviewsPhotos();
