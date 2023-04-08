/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../../server');

describe('GET /reviews', () => {
  it('should return an object in the Atelier format', async () => {
    const res = await request(app)
      .get('/reviews')
      .query({
        product_id: 987046,
      });
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBeGreaterThan(0);

    for (const review of res.body.results) {
      expect(review).toEqual(expect.objectContaining({
        review_id: expect.any(Number),
        rating: expect.any(Number),
        summary: expect.any(String),
        recommend: expect.any(Boolean),
        body: expect.any(String),
        date: expect.any(Number),
        reviewer_name: expect.any(String),
        helpfulness: expect.any(Number),
      }));

      if (review.photos) {
        expect(Array.isArray(review.photos)).toBe(true);
        for (const photo of review.photos) {
          expect(photo).toEqual(expect.objectContaining({
            id: expect.any(Number),
            url: expect.any(String),
          }));
        }
      }
    }
  });
});

describe('GET /reviews/meta', () => {
  it('should return an object in the Atelier format', async () => {
    const res = await request(app)
      .get('/reviews/meta')
      .query({
        product_id: 987046,
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('product_id');
    expect(res.body).toHaveProperty('ratings');
    expect(res.body).toHaveProperty('recommended');
    expect(res.body).toHaveProperty('characteristics');
  });
});

describe('POST /reviews', () => {
  it('should post with the correct body', async () => {
    const requestBody = {
      product_id: 10,
      rating: 2,
      summary: 'This is a summary',
      body: 'This is the body, it should be at least 50 characters',
      recommended: true,
      name: 'Debra',
      email: 'NotDebra@gmail.com',
      photos: ['a.link.com/path', 'another.link'],
      characteristics: { 14: 5, 15: 5 },
    };
    const response = await request(app)
      .post('/reviews')
      .send(requestBody);
    expect(response.status).toBe(201);
  });
});

describe('PUT /reviews/:review_id/helpful', () => {
  it('should post with the correct body', async () => {
    const response = await request(app)
      .put('/reviews/5700129/helpful');
    expect(response.status).toBe(204);
  });
});

describe('PUT /reviews/:review_id/report', () => {
  it('should post with the correct body', async () => {
    const response = await request(app)
      .put('/reviews/5700129/report');
    expect(response.status).toBe(204);
  });
});
