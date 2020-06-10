const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();
const fetch = require("node-fetch");

const app = express();

app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'hello world'
  });
});


app.get('/videos', (req, res) => {
  const playList = process.env.playList || 'PLUwxXjzqxhJzf2nG5LizcTjhmcpwladg7';
  const maxResults = process.env.maxResults || 25;
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playList}`;
  fetch(`${url}&key=${process.env.GOOGLE_API_KEY}`)
    .then(response => response.json())
    .then(json => {
      res.json(json.items);
    });
});

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found');
  next(error);
}

function errorHandler(error, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: statusCode,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
})
