const express = require('express')
const cors = require('cors')
const helmet = require('helmet') // secure headers
const winston = require('winston');
const morgan = require('morgan'); // logging

// const bodyParser = require('body-parser'); you no longer need body-parser package...it comes built into expressJS now

const app = express()
app.use(cors()) // NB! CORS is important for access control. CORS allows restrictive access to servers
app.use(helmet())
app.use(express.json()) // you no longer need body-parser package...it comes built into expressJS now
app.use(morgan('combined'));
app.use(helmet());

// Below piece of code only permits the server to load resources from below sites
// Remove pleabanshee url and check what happens in the Chrome devtools console when you submit data
var whitelist = ['https://pleabanshee.github.io', 'http://example2.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.get('/', (req, res) => {
  // (name, value, {options}): creates a cookie to store server data. Headers prevents cookie from being accessed by client and attackers
  res.cookie('session','1',{httpOnly: true,secure: true});
  // only allows scripts to be run on the host and others provided, thus preventing CSRF
  res.set({
    'Content-Security-Policy': "script-src 'self' 'https://developers.google.com/apis-explorer'"
  });
  res.send('Hello World!')
})

app.post('/secret', (req, res) => {
  const { userInput } = req.body;
  console.log(userInput);
  if (userInput) {
    winston.log('info', 'user input: ' + userInput);
    res.status(200).json('success');
  } else {
    winston.error('This guy is messing with us:' + userInput);
    res.status(400).json('incorrect submission')
  }
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))