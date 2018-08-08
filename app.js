const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser')



var urlencodedParser = bodyParser.urlencoded({ extended: false })

const routes = require('./routes.js')(app);

app.use(express.static('public'));
app.set('view engine', 'ejs');

const port = 8080;

const server = app.listen(8080, function() {
  console.log('Listening to port ' + port);
});
