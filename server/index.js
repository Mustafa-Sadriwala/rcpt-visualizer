const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../config/webpack.config.js');
const fetch = require('node-fetch');

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/../dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api', async (req, res) => {
  let business = req.query.business.toString();
  //let address = req.query.address.toString();
  let response = await fetch('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?' +
          'input=' + business +
          '&locationbias=ipbias' +
          '&inputtype=textquery' +
          '&fields=types' +
          '&key=AIzaSyABT9mnqWYl1vFrfZHoXjMklVX4ooxtKps');
  response = await response.json();

  let json = {'categories': response.candidates[0].types.slice(0,3)}
  res.send(json)
})

app.listen(port, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  // eslint-disable-next-line no-console
  console.info(`Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
});
