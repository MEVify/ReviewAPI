const db = require('../db.js');

module.exports = {
  getReviewData: (page, count, sort, product_id) => {
  let query = `
    SELECT json_build_object(
      'review_id', r.id,
      'rating', r.rating,
      'summary', r.summary,
      'recommend', r.recommend,
      'response', r.response,
      'body', r.body,
      'date', r.date,
      'reviewer_name', r.reviewer_name,
      'helpfulness', r.helpfulness,
      'photos', (
        SELECT json_agg(
          json_build_object(
            'id', rp.id,
            'url', rp.url
          )
        )
        FROM reviews_photos rp
        WHERE rp.review_id = r.id
      )
    ) AS review
    FROM reviews r
    WHERE r.product_id = ${product_id}
    AND r.reported = false`;

  if (sort === 'newest') {
    query += ' ORDER BY r.date DESC';
  } else if (sort === 'helpful') {
    query += ' ORDER BY r.helpfulness DESC';
  } else if (sort === 'relevant') {
    query += ' ORDER BY r.helpfulness DESC, r.date DESC';
  }

  query += ` OFFSET ${(page - 1) * count} LIMIT ${count}`;

  return db.any(query)
    .then(reviews => {
      return {
        product: product_id,
        page,
        count,
        results: reviews.map(review => review.review)
      };
    })
    .catch(err => {
      console.log('err doing query for reviews\n', err)
    })
  },
  getMetaData: (product_id) => {
    const query = `
    SELECT
      json_build_object(
        'product_id', ${product_id},
        'ratings', (
          SELECT
            json_object_agg(r.rating, r.count) AS rating_counts
          FROM
            (
              SELECT
                rating,
                COUNT(*) AS count
              FROM
                reviews
              WHERE
                product_id = ${product_id}
              GROUP BY
                rating
            ) r
        ),
        'recommended', (
          SELECT
            json_build_object(
              '0', COUNT(CASE WHEN recommend = false THEN 1 ELSE NULL END),
              '1', COUNT(CASE WHEN recommend = true THEN 1 ELSE NULL END)
            ) AS recommend_counts
          FROM
            reviews
          WHERE
            product_id = ${product_id}
        ),
        'characteristics', (
          SELECT
            json_object_agg(
              c.name,
              json_build_object(
                'id', c.id,
                'value', (
                  SELECT
                    AVG(cr.value)::numeric(10, 4)
                  FROM
                    characteristics_reviews cr
                  WHERE
                    cr.characteristic_id = c.id
                )
              )
            ) AS characteristics
          FROM
            characteristics c
          WHERE
            c.product_id = ${product_id}
        )
      ) AS meta_data
  `;
  return db.one(query);
},
  addReview: (reviewsData, photos, characteristics) => {
  const reviewQuery = `
    INSERT INTO reviews (product_id, rating, summary, body, recommend, reviewer_name, reviewer_email, date, reported)
    VALUES ($1, $2, $3, $4, $5, $6, $7, EXTRACT( EPOCH FROM now() ), false)
    RETURNING id
  `;
  const photoQuery = `
  INSERT INTO reviews_photos (review_id, url)
  VALUES ($1, $2)
  `;
  const characteristicsQuery = `
  INSERT INTO characteristics_reviews (characteristic_id, review_id, value)
  VALUES ($1, $2, $3)
`;
  return db.tx(t => {
    return t.one(reviewQuery, reviewsData)
      .then(review_id => {
        const promises = photos.map(photo => {
          return t.none(photoQuery, [review_id.id, photo])
        });
        return t.batch(promises)
          .then(() => {
            const cPromises = Object.keys(characteristics).map(characteristic_id => {
              return t.none(characteristicsQuery, [characteristic_id, review_id.id, characteristics[characteristic_id]]);
            });
            return t.batch(cPromises);
          })
      })
  })
},
  incrementReview: (review_id) => {
    return db.none(`UPDATE reviews
    SET helpfulness = helpfulness + 1
    WHERE id = ${review_id}`);
},
  reportReview: (review_id) => {
    return db.none(`UPDATE reviews
    SET reported = true
    WHERE id = ${review_id}`);
  }
}