const bcrypt = require('bcrypt');
const settings = require('./settings');
const jwt = require('jsonwebtoken');

const knex = require('knex')({
  client: 'mysql',
  connection: settings.database
});

const hashPassword = password => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (error, hash) => {
      error ? reject(error) : resolve(hash);
    });
  });
};

const checkPassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (error, response) => {
      if (error) {
        reject(error);
      } else if (response) {
        resolve(response);
      } else {
        reject('Incorrect password');
      }
    });
  });
};

const createToken = payload => {
  const secret = 's3cr3t'; // process.env.secret
  const expiresIn = 3600;
  const token = jwt.sign({ payload }, secret, { expiresIn });
  return token;
};


function insertUser(username, password) {
  return hashPassword(password)
  .then(hash => {
    return knex('users').insert({ username, password: hash });
  }).then(id => {
    return knex.select('id', 'username').from('users').where({ id });
  });
}

function checkUser(username, password) {
  let user = null;
  return knex('users').where({
    username
  }).then(response => {
    if (response.length > 0) {
      user = response[0];
      return checkPassword(password, response[0].password);
    }
  }).then(response => {
    if (response) {
      delete user.password;
      return user;
    } else {
      return false;
    }
  });
}

module.exports = {
  insertUser,
  checkUser,
  createToken
};