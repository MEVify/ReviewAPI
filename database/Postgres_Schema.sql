SET datestyle = "ISO, DMY";

CREATE TABLE characteristics (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  name TEXT NOT NULL
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  date BIGINT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT false,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  response TEXT,
  helpfulness INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE characteristics_reviews (
  id SERIAL PRIMARY KEY,
  characteristic_id INTEGER NOT NULL REFERENCES characteristics(id),
  review_id INTEGER NOT NULL REFERENCES reviews(id),
  value INTEGER NOT NULL
);

CREATE TABLE reviews_photos (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL REFERENCES reviews(id),
  url TEXT NOT NULL
);

CREATE INDEX ON reviews (product_id);
CREATE INDEX ON reviews_photos (review_id);
CREATE INDEX ON characteristics_reviews (review_id);
CREATE INDEX ON characteristics_reviews (characteristic_id);
CREATE INDEX ON characteristics (product_id);