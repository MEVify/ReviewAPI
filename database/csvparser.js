const fs = require('fs');
const csv = require('fast-csv');
const pgPromise = require('pg-promise')();

const db = pgPromise({
  user: 'mevcaus',
  host: 'localhost',
  database: 'reviews',
  password: 'LakeCascade13',
  port: 5432,
});

const insertBatch = async (rows, columnNames, tableName) => {
  const query = pgPromise.helpers.insert(rows, columnNames, tableName)
  await db.none(query)
    .then(() => {
      console.log(`${tableName} imported successfully with ${row.length} rows`)
    })
    .catch(err => {
      console.log('err importing\n', tableName, err)
    })
}
const importCharacteristicsData = () => {
  const stream = fs.createReadStream('./csvfiles/characteristics.csv');
  let rows = [];
  const csvStream = csv.parse({ headers: true })
    .on('data', data => {
      rows.push(data);
    })
    .on('end', () => {
      insertBatch(rows, ['id', 'product_id', 'name'], 'characteristics')
    })
    stream.pipe(csvStream);
}

const importReviewsData = () => {
  const stream = fs.createReadStream('./csvfiles/reviews.csv');
  let rows = [];
  let i = 0;
  const csvStream = csv.parse({ headers: true })
    .on('data', row => {
      let date = row.date;
      if (/^\d{13}$/.test(date)) {
        row.date = `${new Date(date / 1000).toISOString()}`;
      }
      if (row.recommend === 'null') {
        row.recommend = false;
      }
      rows.push(row);
      if (rows.length > 9999) {
        insertBatch(rows, [
          'id',
          'product_id',
          'rating',
          'date',
          'summary',
          'body',
          'recommend',
          'reported',
          'reviewer_name',
          'reviewer_email',
          'response',
          'helpfulness'
        ],
        'reviews'
        );
        rows = [];
        i += 1;
        console.log(i);
      }
    })
    .on('end', () => {
      insertBatch(rows, [
        'id',
        'product_id',
        'rating',
        'date',
        'summary',
        'body',
        'recommend',
        'reported',
        'reviewer_name',
        'reviewer_email',
        'response',
        'helpfulness'
      ],
      'reviews'
    );
    })
    stream.pipe(csvStream);
}

// importCharacteristicsData();
// importReviewsData();