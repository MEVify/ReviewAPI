import http from 'k6/http';
import { sleep, check } from 'k6';
import productIds from './productId.js';

export const options = {
  vus: 50,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should complete within 500ms
    http_req_failed: ['rate<0.1'], // error rate should be less than 10%
  },
  // discardResponseBodies: true,
  // stages: [
  //   { duration: '5m', target: 50 }
  // ],
};

export default function main() {
  const productId = productIds[Math.floor(Math.random() * productIds.length)];

  const batch = [
    { method: 'GET', url: `http://localhost:3000/reviews/meta/?product_id=${productId}` },
    // { method: 'GET', url: `http://localhost:3034/api/products?page=1&count=50`},
  ];

  const responses = http.batch(batch);

  responses.forEach((res) => {
    check(res, {
      'is status 200': (r) => (r.status === 200),
    });
  });
}

// k6 run --out cloud ProductOverview/db/k6/LoadTest.js