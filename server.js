const express = require('express');
const validUrl = require('valid-url')

const app = express();

app.use(express.static('public'))

const urls = {};

app.get('/url', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (!req.query.url) {
    res.end(JSON.stringify({ error: 'Missing url query paramater' }));
    return;
  }
  const isUri = validUrl.isUri(req.query.url);
  if (!isUri) {
    res.end(JSON.stringify({ error: 'Not a valid url. Must be full url with protocol e.g. http:// or https://' }));
    return;
  }
  let shortenedUrl = getRandomInt(1, 10000);
  const originalUrl = req.query.url;
  urls[shortenedUrl] = originalUrl;
  const completeUrl = `http://localhost:3000/${shortenedUrl}`;
  res.send(JSON.stringify({
    originalUrl, shortenedUrl: completeUrl
  }));
  res.end();
});

app.get('/:short', (req, res) => {
  res.redirect(urls[req.params['short']]);
})

app.listen(3000, () => console.log('Server started'));

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}