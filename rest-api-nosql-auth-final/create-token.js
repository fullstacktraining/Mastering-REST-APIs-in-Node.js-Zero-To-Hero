const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');
const mongo_uri = `mongodb://${settings.database.host}:${settings.database.port}`;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const username = 'adam';
const password = 'password';

MongoClient.connect(mongo_uri, { useNewUrlParser: true })
.then(client => {
  const db = client.db('project');
  const collection = db.collection('users');
  collection.findOne({ username }).then(response => {
    bcrypt.compare(password, response.password, (error, result) => {
      if (result) {
        console.log('Authentication successful');
        const payload = {
          username: 'adam',
          isAdmin: false
        };
        const secret = 's3cr3t';
        const expiresIn = 60;
        const token = jwt.sign(payload, secret, { expiresIn });
        console.log(token);
      }
    });
  });
}).catch(error => console.error(error));