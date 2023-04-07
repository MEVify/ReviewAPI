const express = require('express');
const router = require('./router.js');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(router)
app.use(morgan('dev'));
app.use(cors());

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})