require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const originaUrl = [];
const shortUrl = [];


app.post('/api/shorturl', (req, res) => {
  const urlRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/;
  const {url} = req.body
  const findUrlIndex = originaUrl.findIndex(ele => ele === url);

  if ( !url.includes("http://") && !url.includes("https://") ) {
    return res.json({
      error: 'invalid url'
    })
  }
  if( findUrlIndex < 0 ) {
    originaUrl.push(url)
    shortUrl.push(shortUrl.length + 1)
    res.json({
      original_url: url,
      short_url: shortUrl.length
    })
  }else{
    res.json({
      original_url: url,
      short_url: shortUrl[findUrlIndex]
    })
  }
});

app.get('/api/shorturl/:url', (req, res) => { 
  const {url} = req.params;
  const findUrl = shortUrl.findIndex(ele => ele == url);
  if ( findUrl > 0 ) {
    res.redirect(originaUrl[shortUrl.length-1])
  }else {
    res.json({
      error: "No short URL found for the given input"
    })
  }
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
