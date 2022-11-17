const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
const dotenv = require('dotenv');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function (req, res) {
  const { firstName, lastName, email } = req.body;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us13.api.mailchimp.com/3.0/lists/3faffb960b';

  const options = {
    method: 'POST',
    auth: process.env.AUTH_KEY,
  };

  const request = https.request(url, options, function (response) {
    if (
      firstName === null ||
      firstName == '' ||
      lastName === null ||
      lastName == '' ||
      email === null ||
      email == ''
    ) {
      res.sendFile(__dirname + '/failure.html');
    } else if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }
    response.on('data', function (data) {
      // console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post('/failure', function (req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server is running');
});
