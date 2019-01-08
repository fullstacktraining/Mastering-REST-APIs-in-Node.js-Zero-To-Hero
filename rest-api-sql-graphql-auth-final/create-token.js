const settings = require('./settings');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const knex = require('knex')({
  client: 'mysql',
  connection: settings.database
});

// assuming that this info is coming from a form from a web app
const username = 'adam';
const password = 'password';

knex('users').where({
  username
}).then(response => {
  // password => raw password from a form, response[0].password => hashed in DB
  bcrypt.compare(password, response[0].password, (error, result) => {
    if (result) {
      console.log('Authentication successful');
      const payload = {
        username: 'adam',
        isAdmin: true
      };
      const secret = 's3cr3t'; // process.env.secret
      const expiresIn = 3600;
      const token = jwt.sign(payload, secret, { expiresIn });
      console.log(token);
    } else {
      console.log('Incorrect password');
    }
  });
});

/* eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkYW0iLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE1NDM5MjMyNzUs
ImV4cCI6MTU0MzkyNjg3NX0.g3msUSNgWVQDUu-XolMjwMZFYktyLbcyPrUWKVdK2x0
*/