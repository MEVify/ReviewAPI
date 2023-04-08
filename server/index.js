const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const router = require('./router');

const app = express();
const port = 3000;

app.use(express.json());
app.use(router);
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

app.listen(port, () => {
});

module.exports = app;
